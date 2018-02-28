export const data = [
  {
    "id": 1,
    "importance": 3,
    "type": "political",
    "properties": {
      "title": "The Syrian Civil War",
      "description": "The ongoing civil war",
      "geo": {
        "location": "Damascus",
        "map": "Syria"
      },
      "coordinates": {
        "x": 700,
        "y": 200
      }
    },
    "ripples": [
      {
        "id": 1,
        "type": "ripple type i.e. paths, single event",
        "type_properties": {
          "coordinates": {
            "x": 0.01,
            "y": 0.05
          },
          "color": "red"
        },
        "media": {
          "id": 1,
          "type": "video",
          "file": "video",
          "extension": "ogv",
          "volume": 50,
          "allow_drag": true,
          "allow_click": false,
          "auto_close": true,
          "auto_play": true
        },
        "properties": {
          "title": "Syrian regime bombs civilians in Eastern Ghouta",
          "description": "A besieged area consisting of young families and children on the outskirts of Damascus has been under constant bombing. A child's scream generally reaches 115 decibels. A bomb exploding reaches 240 - 280 decibels.<br /><br />It has been estimated that 393,000 people have been trapped in this region since mid-November 2017.",
          "location": "bottom"
        },
        "content": [
          {
            "media_id": 1,
            "coordinates": {
              "x": 0.015,
              "y": 0.02
            },
            "interval": 420,
            "properties": {
              "title": "content title",
              "text": "content information"
            }
          }
        ]
      }
    ],
    "stats": [
      {
        "type": "stat type i.e. deaths",
        "value": 12312,
        "progression": {
          "type": "overtime, does it increase or decrease?",
          "value": 12,
          "rate": {
            "type": "is it daily, monthly, per second?",
            "value": 23
          }
        }
      }
    ]
  }

]
