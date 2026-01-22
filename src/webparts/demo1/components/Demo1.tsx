import * as React from 'react';
import styles from './Demo1.module.scss';
import type { IDemo1Props } from './IDemo1Props';

const Demo1: React.FC<IDemo1Props> = (props) => {

  return (
    <section className={`${styles.demo1} ${props.hasTeamsContext ? styles.teams : ''}`}>
      <div>
        <h2>Color Palette Generator</h2>
        <p>Click any color to copy its hex code to clipboard</p>
      </div>
    </section>
  );
};

export default Demo1;
