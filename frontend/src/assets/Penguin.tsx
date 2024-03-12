import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Penguin({
  number = 0,
  showWelcome = false,
}: Readonly<{
  number?: number;
  showWelcome?: boolean;
}>) {
  const penguin = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap
        .timeline()
        .to(".penguin__wing--left", {
          rotate: "-45deg",
          translateY: "9px",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.1,
        })
        .to(".penguin__wing--right", {
          rotate: "45deg",
          translateY: "10px",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.1,
        })
        .to(".penguin__eye", {
          height: "8px",
          duration: 0.01,
          translateY: "-5px",
          reversed: true,
          repeat: -1,
          repeatDelay: 1.5,
          yoyo: true,
        });
    },
    { scope: penguin }
  );

  return (
    <div className="penguin-container" ref={penguin}>
      <div className="word-bubble">
        {showWelcome
          ? "Hi there!"
          : `${number <= 0 ? "No" : number} new quotes!`}
      </div>

      <div className="penguin">
        <div className="penguin__tail"></div>
        <div className="penguin__feet"></div>
        <div className="penguin__body"></div>
        <div className="penguin__head"></div>
        <div className="penguin__eye"></div>
        <div className="penguin__wings">
          <div className="penguin__wing--left"></div>
          <div className="penguin__wing--right"></div>
        </div>
      </div>
    </div>
  );
}

// src: https://codepen.io/wendko
