import * as React from 'react'
import * as actions from '../../actions/actions'
import {withRouter} from 'react-router'
import {data} from '../../../public/data.js'
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import styles from "../Event/EventStyles";

const THREE = require('three')
const TWEEN = require('@tweenjs/tween.js')
const TextSprite = require('three.textsprite')

import 'three/trackballcontrols'

export namespace Canvas {
  export interface Props {
    actions?: typeof actions,
    history?: any,
  }

  export interface State {
    data: any,
    loading: boolean,
    lastHoveredEvent: any,
    mouseDown: boolean
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions as any, dispatch)
  }
}

@connect(null, mapDispatchToProps)
class Canvas extends React.PureComponent<Canvas.Props, Canvas.State> {
  // svg setup
  private svgContainer: any

  //three setup
  private _scene: THREE.Scene | any
  private _camera: THREE.PerspectiveCamera | any
  private _renderer: THREE.WebGLRenderer
  private _light: THREE.DirectionalLight
  private _mouse: THREE.Vector2
  private _raycaster: THREE.Raycaster
  private _controls: THREE.TrackballControls
  private _clock = THREE.Clock
  private _plane = THREE.Plane

  private interval: any
  private setInterval: any

  constructor(props?: any, context?: any) {
    super(props, context)
    this.state = {
      data: [],
      loading: true,
      lastHoveredEvent: {},
      mouseDown: false
    }

    // three setup
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 3000)
    this._camera.position.z = 300
    this._camera.lookAt(new THREE.Vector3(0, 0, 0))
    this._renderer = new THREE.WebGLRenderer({antialias: true})
    this._light = new THREE.SpotLight(0xffffff)
    this._mouse = new THREE.Vector2()
    this._raycaster = new THREE.Raycaster()
    this._controls = new THREE.TrackballControls(this._camera)
    this._scene.updateMatrixWorld()
    this._clock = new THREE.Clock()

    // plane setup
    this._plane = new THREE.Mesh(
      new THREE.PlaneGeometry(450, 450, 200, 200),
      new THREE.ShaderMaterial({
        uniforms: {
          u_amplitude: {value: 25},
          u_frequency: {value: 5},
          u_time: {value: 0},
        },
        vertexShader: `precision highp float;

	uniform float		u_amplitude;
	uniform float 	u_frequency;
	uniform float   u_time;
	
	//
	// https://github.com/hughsk/glsl-noise/blob/master/classic/3d.glsl
	//
	// GLSL textureless classic 3D noise "cnoise",
	// with an RSL-style periodic variant "pnoise".
	// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
	// Version: 2011-10-11
	//
	// Many thanks to Ian McEwan of Ashima Arts for the
	// ideas for permutation and gradient selection.
	//
	// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
	// Distributed under the MIT license. See LICENSE file.
	// https://github.com/ashima/webgl-noise
	//

	vec3 mod289(vec3 x)
	{
		return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 mod289(vec4 x)
	{
		return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 permute(vec4 x)
	{
		return mod289(((x*34.0)+1.0)*x);
	}

	vec4 taylorInvSqrt(vec4 r)
	{
		return 1.79284291400159 - 0.85373472095314 * r;
	}

	vec3 fade(vec3 t) {
		return t*t*t*(t*(t*6.0-15.0)+10.0);
	}

	// Classic Perlin noise
	float cnoise(vec3 P)
	{
		vec3 Pi0 = floor(P); // Integer part for indexing
		vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
		Pi0 = mod289(Pi0);
		Pi1 = mod289(Pi1);
		vec3 Pf0 = fract(P); // Fractional part for interpolation
		vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
		vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
		vec4 iy = vec4(Pi0.yy, Pi1.yy);
		vec4 iz0 = Pi0.zzzz;
		vec4 iz1 = Pi1.zzzz;

		vec4 ixy = permute(permute(ix) + iy);
		vec4 ixy0 = permute(ixy + iz0);
		vec4 ixy1 = permute(ixy + iz1);

		vec4 gx0 = ixy0 * (1.0 / 7.0);
		vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
		gx0 = fract(gx0);
		vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
		vec4 sz0 = step(gz0, vec4(0.0));
		gx0 -= sz0 * (step(0.0, gx0) - 0.5);
		gy0 -= sz0 * (step(0.0, gy0) - 0.5);

		vec4 gx1 = ixy1 * (1.0 / 7.0);
		vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
		gx1 = fract(gx1);
		vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
		vec4 sz1 = step(gz1, vec4(0.0));
		gx1 -= sz1 * (step(0.0, gx1) - 0.5);
		gy1 -= sz1 * (step(0.0, gy1) - 0.5);

		vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
		vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
		vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
		vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
		vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
		vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
		vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
		vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

		vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
		g000 *= norm0.x;
		g010 *= norm0.y;
		g100 *= norm0.z;
		g110 *= norm0.w;
		vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
		g001 *= norm1.x;
		g011 *= norm1.y;
		g101 *= norm1.z;
		g111 *= norm1.w;

		float n000 = dot(g000, Pf0);
		float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
		float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
		float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
		float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
		float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
		float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
		float n111 = dot(g111, Pf1);

		vec3 fade_xyz = fade(Pf0);
		vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
		vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
		float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
		return 2.2 * n_xyz;
	}

	void main() {

		float displacement = u_amplitude * cnoise( u_frequency * position + u_time );

		vec3 newPosition = position + normal * displacement;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
		
	}`,
        fragmentShader: `precision highp float;

	void main() {
    gl_FragColor = vec4(0.85, 0.85, 0.85, 1.0);
	}`,
        side: THREE.FrontSide,
        wireframe: true
      })
    )
    this._scene.add(this._plane)

    this.interval = 0

    // Trackball Controls
    this._controls.rotateSpeed = 3.6
    this._controls.zoomSpeed = 0.8
    this._controls.panSpeed = 1

    this._controls.noZoom = false
    this._controls.noPan = false

    const cameraSpeed = 1

    // Camera Controls
    this._camera.reset = () => {
      new TWEEN.Tween(this._camera.position)
      .to({
        x: 0,
        y: 0,
        z: 300
      }, cameraSpeed * 1000)
      .easing(TWEEN.Easing.Cubic.Out).start()
    }

    this._camera.zoom = object => {
      if (object instanceof THREE.Mesh) {
        const position = new THREE.Vector3()
        position.setFromMatrixPosition(object.matrixWorld)

        new TWEEN.Tween(this._camera.position)
        .to({
          x: position.x,
          y: position.y,
          z: 30
        }, cameraSpeed * 1000)
        .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }

    this._camera.fullZoom = object => {
      if (object instanceof THREE.Mesh) {
        const position = new THREE.Vector3()
        position.setFromMatrixPosition(object.matrixWorld)

        new TWEEN.Tween(this._camera.position)
        .to({
          x: position.x,
          y: position.y,
          z: 10
        }, cameraSpeed * 3000)
        .easing(TWEEN.Easing.Cubic.Out).start()
      }
    }

    this._controls.staticMoving = false
    this._controls.dynamicDampingFactor = 0.12
    this._controls.enabled = true
  }

  public createScene = (): void => {
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.setClearColor('#FFF')
    this.svgContainer.appendChild(this._renderer.domElement)
    this._light.position.set(0, 0, 150)
    this._light.castShadow = true
    this._light.shadow.mapSize.height = 512
    this._light.shadow.mapSize.width = 512
    this._light.shadow.camera.near = 0
    this._light.shadow.camera.far = 250
    this._scene.add(this._light)
  }

  componentDidMount() {
    this.init()
    if (!this.state.data.length) {
      this.setState({data: data},
        () => {
          this.createEvents()
        })
    }
  }

  componentWillUnmount() {
    clearInterval(this.setInterval._id)

    // do I really have to do this tho?
    this.animate = null
  }

  private init = (): void => {
    this.createScene()
    this.animate()
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  createEvents = () => {
    this.state.data.forEach(event => {
      const group = new THREE.Group()
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(10, 64, 64),
        new THREE.MeshPhongMaterial({
          color: event.colors.backgroundColor,
          emissive: new THREE.Color('#c7c7c7'),
          specular: new THREE.Color('#324e6e'),
          shininess: 1,
          shading: THREE.SmoothShading
        })
      )
      sphere.position.set(0, 0, 0)
      this._scene.add(sphere)

      const sprite = new TextSprite({
        textSize: 5,
        redrawInterval: false,
        texture: {
          text: event.properties.title,
          fontFamily: 'Lora'
        },
        material: {
          color: "#6b6b6b",
        }
      })
      // sprite.name = `text-${stat.id}`
      sprite.position.set(0, -15, 5)

      group.add(sprite)
      group.add(sphere)
      group.name = `Event${event.id}`
      group.position.set(event.properties.coordinates.x, event.properties.coordinates.y, 0)
      this._scene.add(group)
    })
  }

  public animate = (): void => {
    requestAnimationFrame(this.animate)
    this._render()
    TWEEN.update()
    this.updatePlane()

    if (!this.state.mouseDown) {
      this._camera.reset()
      this.interval = 0
      if (this.setInterval) {
        clearInterval(this.setInterval._id)
      }
    } else {
      if (this.interval > 0) {
        this._camera.zoom(this.state.lastHoveredEvent.object)

        if (this.interval > 1) {
          this._camera.fullZoom(this.state.lastHoveredEvent.object)
          const name = this.state.lastHoveredEvent.object.parent.name
          const id = name.replace('Event', '')
          const item = this.state.data.filter(q => q.id === Number(id))
          this.showEventInfo(item[0])

          // if (this.interval > 5) {
          //   this.showEventInfo(item[0])
          // }
        }
      }
    }
  }

  private updatePlane = () => {
    this._plane.geometry.verticesNeedUpdate = true
    this._plane.geometry.vertices.forEach(v => {
      v.x += 0.001
    })
  }

  private handleMouseMove = (event) => {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    this._raycaster.setFromCamera(this._mouse, this._camera)

    if (this.state.data.length) {
      let intersects = []
      let group: any = {}
      this.state.data.forEach(event => {
        group = this._scene.getObjectByName(`Event${event.id}`)
      })

      const raycaster = this._raycaster.intersectObject(group, true)
      if (raycaster.length) {
        intersects = raycaster
      }

      if (intersects.length) {
        document.body.style.cursor = 'pointer'
        this.setState({lastHoveredEvent: intersects[0]})
        group.traverse(child => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
            // child.material.color = new THREE.Color('#767676')
          }
        })
      } else {
        document.body.style.cursor = 'default'
        if (this.state.lastHoveredEvent) {
          group.traverse(child => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
              // child.material.color = new THREE.Color('#000000')
            }
          })
        }
      }
    }
  }

  private handleMouseDown = (event) => {
    if (this.state.lastHoveredEvent) {
      this.setState({mouseDown: true}, () => {
        this.setInterval = setInterval(() => {
          this.interval++
        }, 1000)
      })
    }
  }

  private handleMouseUp = (event) => {
    this.setState({mouseDown: false})
    clearInterval(this.setInterval._id)
    this.interval = 0
  }

  private showEventInfo = (item: any): any => {
    this.props.actions.eventActive({data: item})
    this.props.history.push({
      pathname: `/${item.id}`,
    })
  }

  private _render = (): void => {
    this._renderer.render(this._scene, this._camera)
  }

  public render() {
    // return this.state.data.map(item => (
    //   <div key={item.id}>
    //     {item.importance}
    //   </div>
    // ))
    return (
      <div>
        <span style={{
          position: 'absolute' as 'absolute',
          top: 150,
          width: window.innerWidth,
          textAlign: 'center',
          color: '#000000',
          zIndex: 10,
          opacity: this.state.mouseDown ? 1 : 0,
          transition: 'opacity 4s ease-in-out',
        }}>Keep holding the button.</span>
        <div
          style={styles.svgContainer}
          ref={node => this.svgContainer = node}
        />
      </div>

    )
  }
}

export default withRouter(Canvas)
