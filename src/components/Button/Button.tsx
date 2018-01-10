import * as React from 'react';
import './Button.css'

export interface Props {
  label: string;
  link: string;
}

function Continue(link: String) {
  console.log(link);
}

function Button({ label, link }: Props) {
  return (
    <button className="button" onClick={() => Continue(link)}>
      {label}
    </button>
  );
}

export default Button;