import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "remixicon/fonts/remixicon.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [showContent, setShowContent] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const secondSectionRef = useRef(null);
  const featuresData = [
    {
      id: 0,
      title: "HEISTS",
      description:
        "Plan and execute elaborate heists with your crew. Every decision matters in the high-stakes world of Los Santos.",
    },
    {
      id: 1,
      title: "CHARACTERS",
      description:
        "Experience the intertwining stories of Michael, Franklin, and Trevor as they navigate the criminal underworld.",
    },
    {
      id: 2,
      title: "OPEN WORLD",
      description:
        "Explore a vast, detailed recreation of Southern California, from mountains to oceans to the urban sprawl.",
    },
  ];

  // Prevent right-click on images
  useEffect(() => {
    const preventImageRightClick = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", preventImageRightClick);

    return () => {
      document.removeEventListener("contextmenu", preventImageRightClick);
    };
  }, []);

  useGSAP(() => {
    const timeLine = gsap.timeline();

    timeLine
      .to(".v-mask-group", {
        rotate: 360,
        duration: 4,
        ease: "power4.inOut",
        transformOrigin: "50% 50%",
      })
      .to(".v-mask-group", {
        scale: 10,
        duration: 2,
        delay: -2.2,
        ease: "expo.inOut",
        transformOrigin: "50% 50%",
        opacity: 0,
        backgroundColor: "white",
        onUpdate: function () {
          if (this.progress() >= 0.9) {
            requestAnimationFrame(() => {
              setShowContent(true);
            });
            this.kill();
          }
        },
      });
  });

  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main", {
      opacity: 1,
      duration: 0.5,
      ease: "power4.inOut",
    });
  }, [showContent]);

  useGSAP(() => {
    if (!showContent) return;
    gsap.to(".characterImage", {
      bottom: "-55%",
      delay: -1,
      ease: "expo.inOut",
      duration: 2,
    });
    gsap.to(".text", {
      scale: 1,
      delay: -1,
      ease: "expo.inOut",
      duration: 2,
    });

    const main = document.querySelector(".main");

    main?.addEventListener("mousemove", function (e) {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;

      gsap.to(".imageDiv .text", {
        x: `${xMove * 0.4}%`,
      });
      gsap.to(".imageDiv .skyImage", {
        x: xMove,
      });
      gsap.to(".imageDiv .bgImage", {
        x: xMove * 1.7,
      });
      gsap.to(".imageDiv .characterImage", {
        x: -xMove * 0.2,
      });
    });

    // Add scroll animations for second section
    if (secondSectionRef.current) {
      // Character image entrance
      gsap.fromTo(
        ".feature-character",
        { x: "-100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: secondSectionRef.current,
            start: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Content panels staggered entrance
      gsap.fromTo(
        ".feature-content",
        { y: "50px", opacity: 0 },
        {
          y: "0",
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: secondSectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Rating stars animation
      gsap.fromTo(
        ".star",
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(2.5)",
          scrollTrigger: {
            trigger: ".game-ratings",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, [showContent]);

  // Auto-rotate features
  useEffect(() => {
    if (!showContent) return;

    const intervalId = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % featuresData.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [showContent, featuresData.length]);

  // CSS to prevent image selection
  const noSelectStyle = {
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    pointerEvents: "none", // Prevents drag operations
  };

  // CSS to allow interaction but prevent selection
  const interactNoSelectStyle = {
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    pointerEvents: "auto", // Allows mouse events but prevents selection
  };

  return (
    <>
      <div className="bg-black w-full min-h-screen">
        {!showContent && (
          <div className="svg flex items-center justify-center left-0 top-0 fixed z-[100] w-full h-screen overflow-hidden bg-black">
            <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <mask id="vMask">
                  <rect width="100%" height="100%" fill="black" />
                  <g className="v-mask-group">
                    <text
                      x="50%"
                      y="50%"
                      fontSize="250"
                      textAnchor="middle"
                      fill="white"
                      dominantBaseline="middle"
                      fontFamily="Arial Black"
                    >
                      V
                    </text>
                  </g>
                </mask>
              </defs>
              <image
                href="./bg.png"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                mask="url(#vMask)"
                style={noSelectStyle}
              />
            </svg>
          </div>
        )}
        {showContent && (
          <div className="main opacity-0 w-full">
            <div className="landing overflow-hidden relative w-full h-screen bg-black">
              <div className="navbar absolute top-0 left-0 z-10 w-full py-10 px-10">
                <div className="logo flex gap-5">
                  <div className="lines flex flex-col gap-[5px]">
                    <div className="line w-15 h-2 bg-white"></div>
                    <div className="line w-10 h-2 bg-white"></div>
                    <div className="line w-5 h-2 bg-white"></div>
                  </div>
                  <h3 className="text-4xl -mt-[9px] leading-none text-white">
                    Rockstar
                  </h3>
                </div>
              </div>
              <div
                className="imageDiv relative w-full h-screen overflow-hidden"
                style={interactNoSelectStyle}
              >
                <img
                  className="skyImage scale-[1.2] absolute top-0 left-0 w-full h-full object-cover"
                  src="./sky.png"
                  alt="Background Sky Image"
                  style={noSelectStyle}
                  draggable="false"
                />
                <img
                  className="bgImage scale-[1.1] absolute top-0 left-0 w-full h-full object-cover"
                  src="./bg.png"
                  alt="Background Image"
                  style={noSelectStyle}
                  draggable="false"
                />
                <div className="text scale-[1.8] absolute flex flex-col gap-3 top-0 left-1/2 -translate-x-1/2 text-white">
                  <h1 className="text-8xl leading-none -ml-5">grand</h1>
                  <h1 className="text-8xl leading-none ml-60">theft</h1>
                  <h1 className="text-8xl leading-none -ml-13">auto</h1>
                </div>
                <img
                  className="characterImage absolute -bottom-[75%] left-1/2 -translate-x-1/2 scale-[0.8]"
                  src="./girlbg.png"
                  alt="Background Character Image"
                  style={noSelectStyle}
                  draggable="false"
                />
              </div>
              <div className="btmbar text-white absolute bottom-0 left-0 z-10 w-full py-15 px-10 bg-gradient-to-t from-black to-transparent">
                <div className="flex gap-4 items-center">
                  <i className="ri-arrow-down-line text-3xl"></i>
                  <h3 className="font-[Helvetica_Now_Display] text-xl">
                    Scroll Down
                  </h3>
                </div>
                <img
                  className="h-[40px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="./ps5.png"
                  alt="Console Logo"
                  style={noSelectStyle}
                  draggable="false"
                />
              </div>
            </div>

            {/* Second Section - Enhanced */}
            <div
              ref={secondSectionRef}
              className="w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-black via-black to-[#050a14]"
            >
              {/* Animated background grid lines */}
              <div
                className="absolute inset-0 grid-overlay opacity-20"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              ></div>

              <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Game title with glitch effect */}
                <div className="text-center mb-16">
                  <h1
                    className="game-title relative inline-block text-7xl font-bold text-white mb-2"
                    style={{
                      textShadow:
                        "0 0 10px rgba(0,255,255,0.3), 0 0 20px rgba(0,255,255,0.2)",
                      fontFamily: "Impact, sans-serif",
                    }}
                  >
                    <span
                      className="glitch-layer absolute top-0 left-0 text-yellow-500 opacity-80"
                      style={{
                        textShadow: "2px 0 #ff0000",
                        animation: "glitch1 3s infinite",
                        clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                        transform: "translate(-2px, 0)",
                      }}
                    >
                      GRAND THEFT AUTO V
                    </span>
                    GRAND THEFT AUTO V
                    <span
                      className="glitch-layer absolute top-0 left-0 text-cyan-500 opacity-80"
                      style={{
                        textShadow: "-2px 0 #0000ff",
                        animation: "glitch2 2.5s infinite",
                        clipPath: "polygon(0 80%, 100% 20%, 100% 100%, 0 100%)",
                        transform: "translate(2px, 0)",
                      }}
                    >
                      GRAND THEFT AUTO V
                    </span>
                  </h1>
                  <div className="digital-frame w-32 h-2 bg-yellow-500 mx-auto relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      style={{
                        animation: "scanline 2s linear infinite",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Left side - Character image with animated border */}
                  <div className="feature-character w-full lg:w-1/2 relative">
                    <div
                      className="animated-border absolute -inset-1 rounded-lg bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600"
                      style={{
                        backgroundSize: "200% 200%",
                        animation: "border-animation 6s linear infinite",
                      }}
                    ></div>
                    <div className="relative bg-gray-900 p-2 rounded-lg overflow-hidden">
                      <img
                        alt="GTA V Characters"
                        src="./imag.png"
                        className="w-full h-auto object-cover rounded-lg transform transition-transform hover:scale-105 duration-700"
                        style={noSelectStyle}
                        draggable="false"
                      />
                      {/* Scan line effect */}
                      <div
                        className="scan-line absolute inset-0 pointer-events-none opacity-10"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)",
                          backgroundSize: "100% 4px",
                          animation: "scanline 8s linear infinite",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Right side - Game info and features */}
                  <div className="w-full lg:w-1/2 flex flex-col gap-8">
                    {/* Game description panel with tech frame */}
                    <div className="feature-content game-description relative overflow-hidden bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                      {/* Tech corner decorations */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500"></div>

                      <h2 className="text-5xl text-yellow-500 font-bold mb-6">
                        Los Santos Awaits
                      </h2>
                      <p className="text-xl text-gray-300 mb-4 leading-relaxed font-[Helvetica_Now_Display]">
                        Step into the vibrant and dangerous world of Los Santos
                        in GTA V, where you live out the high-stakes lives of
                        three unique characters. From high-speed getaways and
                        heists to everyday chaos, the game immerses you in a
                        cinematic journey full of action, choices, and
                        consequences.
                      </p>
                      <p className="text-xl text-gray-300 mb-6 leading-relaxed font-[Helvetica_Now_Display]">
                        With a massive open world and dynamic gameplay, GTA V
                        blends storytelling and exploration like no other.
                        Whether playing solo or in GTA Online, the city is yours
                        to command.
                      </p>
                    </div>

                    {/* Interactive features section */}
                    <div className="feature-content features-showcase relative overflow-hidden bg-black bg-opacity-40 backdrop-filter backdrop-blur-sm p-6 rounded-lg border border-gray-800">
                      <h3 className="text-2xl text-white font-bold mb-4">
                        KEY FEATURES
                      </h3>

                      {/* Tabs navigation */}
                      <div className="flex border-b font-[Helvetica_Now_Display] border-gray-700 mb-4">
                        {featuresData.map((feature) => (
                          <button
                            key={feature.id}
                            className={`px-4 py-2 mr-2 text-sm font-medium transition-all duration-300 ${
                              activeFeature === feature.id
                                ? "text-yellow-500 border-b-2 border-yellow-500"
                                : "text-gray-400 hover:text-white"
                            }`}
                            onClick={() => setActiveFeature(feature.id)}
                          >
                            {feature.title}
                          </button>
                        ))}
                      </div>

                      {/* Tab content */}
                      <div className="feature-tab-content py-2 font-[Helvetica_Now_Display]">
                        {featuresData.map((feature) => (
                          <div
                            key={feature.id}
                            className={`transition-opacity duration-500 ${
                              activeFeature === feature.id
                                ? "block opacity-100"
                                : "hidden opacity-0"
                            }`}
                          >
                            <p className="text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Game ratings and CTA */}
                    <div className="feature-content flex flex-col sm:flex-row gap-6 items-center">
                      {/* Ratings */}
                      <div className="game-ratings flex flex-col items-center bg-black bg-opacity-50 p-4 rounded-lg">
                        <p className="text-white text-sm mb-1 font-[Helvetica_Now_Display]">
                          RATING
                        </p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className="star ri-star-fill text-yellow-500 text-2xl"
                            ></i>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className="cta-button relative overflow-hidden w-full sm:w-auto text-xl font-bold tracking-wide px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-md transition-all hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] focus:outline-none">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <i className="ri-download-line"></i>
                          DOWNLOAD NOW
                        </span>
                        <span className="button-glow absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-0 hover:opacity-30 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* System requirements */}
                <div className="feature-content mt-12 bg-black bg-opacity-40 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl text-yellow-500 font-bold mb-4 flex items-center">
                    <i className="ri-computer-line mr-2"></i>
                    SYSTEM REQUIREMENTS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300 font-[Helvetica_Now_Display]">
                    <div>
                      <h4 className="text-white text-lg mb-2">MINIMUM</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • Intel Core i5 3470 @ 3.2GHZ / AMD X8 FX-8350 @ 4GHZ
                        </li>
                        <li>• 8GB RAM</li>
                        <li>• NVIDIA GTX 660 2GB / AMD HD 7870 2GB</li>
                        <li>• 72GB HDD Space</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white text-lg mb-2">RECOMMENDED</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Intel Core i7-4770K / AMD Ryzen 5 1500X</li>
                        <li>• 16GB RAM</li>
                        <li>• NVIDIA GTX 1060 6GB / AMD RX 480 4GB</li>
                        <li>• 72GB SSD Space</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Particle effect overlay */}
              <div className="particle-overlay absolute inset-0 pointer-events-none opacity-30"></div>
            </div>
          </div>
        )}
      </div>

      {/* Add some global CSS animations */}
      <style jsx global>{`
        @keyframes border-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes glitch1 {
          0%,
          100% {
            transform: translate(-2px, 0);
          }
          20% {
            transform: translate(-4px, 3px);
          }
          60% {
            transform: translate(-5px, 1px);
          }
        }

        @keyframes glitch2 {
          0%,
          100% {
            transform: translate(2px, 0);
          }
          30% {
            transform: translate(4px, -3px);
          }
          70% {
            transform: translate(6px, -1px);
          }
        }
      `}</style>
    </>
  );
};

export default LandingPage;
