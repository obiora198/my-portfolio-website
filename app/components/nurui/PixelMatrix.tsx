"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
  isVisible?: boolean;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
  isVisible = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
  isVisible?: boolean;
}) => {
  return (
    <div className={`h-full relative w-full rounded-2xl ${containerClassName}`}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? "u_reverse_active" : "false"}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
          isVisible={isVisible}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
  isVisible?: boolean;
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 25,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
  isVisible = true,
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        
        // Optimized random function
        float random(vec2 xy) {
            return fract(sin(dot(xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            // Early exit for out of bounds
            if (st.x < 0.0 || st.y < 0.0) {
                fragColor = vec4(0.0);
                return;
            }

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            // Simplified frequency
            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            
            float opacity = u_opacities[int(rand * 10.0)];
            
            // Combine dot checks
            vec2 dotCheck = step(u_dot_size / u_total_size, fract(st / u_total_size));
            opacity *= (1.0 - dotCheck.x) * (1.0 - dotCheck.y);

            // Early exit if opacity is zero
            if (opacity < 0.01) {
                fragColor = vec4(0.0);
                return;
            }

            vec3 color = u_colors[int(show_offset * 6.0)];

            // Optimized animation timing
            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / (2.0 * u_total_size);
            float dist_from_center = distance(center_grid, st2);

            float timing_offset;
            if (u_reverse == 1) {
                float max_grid_dist = length(center_grid);
                timing_offset = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);
                opacity *= 1.0 - step(timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((step(timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                timing_offset = dist_from_center * 0.01 + (random(st2) * 0.15);
                opacity *= step(timing_offset, u_time * animation_speed_factor);
                opacity *= clamp((1.0 - step(timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color * opacity, opacity);
        }`}
      uniforms={uniforms}
      maxFps={30}
      isVisible={isVisible}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 30,
  isVisible = true,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
  isVisible?: boolean;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const lastFrameTime = useRef(0);
  const frameInterval = 1000 / maxFps;
  const animationStartTime = useRef<number | null>(null);
  const pausedTime = useRef(0);

  useFrame(({ clock }: { clock: any }) => {
    if (!ref.current) return;
    
    // Don't update if not visible
    if (!isVisible) {
      if (animationStartTime.current !== null) {
        pausedTime.current = clock.getElapsedTime();
      }
      return;
    }

    // Initialize start time when becoming visible
    if (animationStartTime.current === null) {
      animationStartTime.current = clock.getElapsedTime() - pausedTime.current;
    }
    
    const timestamp = clock.getElapsedTime();
    const now = timestamp * 1000;

    // FPS throttling
    if (now - lastFrameTime.current < frameInterval) return;
    lastFrameTime.current = now;

    const material = ref.current.material as THREE.ShaderMaterial;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp - (animationStartTime.current || 0);
  });

  const getUniforms = () => {
    const preparedUniforms: Record<string, { value: unknown; type?: string }> =
      {};

    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value as number[]),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: Array.isArray(uniform.value)
              ? (uniform.value as number[][]).map((v: number[]) =>
                  new THREE.Vector3().fromArray(v),
                )
              : [],
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value as number[]),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ 
  source, 
  uniforms, 
  maxFps = 30,
  isVisible = true 
}) => {
  return (
    <Canvas 
      className="absolute inset-0 h-full w-full"
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      frameloop={isVisible ? "always" : "never"}
    >
      <ShaderMaterial 
        source={source} 
        uniforms={uniforms} 
        maxFps={maxFps}
        isVisible={isVisible}
      />
    </Canvas>
  );
};