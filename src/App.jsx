import { Center, Environment, OrbitControls, Text3D } from "@react-three/drei";
import { Canvas, extend } from '@react-three/fiber'
import Utilities from "./r3f-gist/utility/Utilities";
import { Addition, Base, Difference, Geometry, Intersection, ReverseSubtraction, Subtraction } from "@react-three/csg";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import { useMemo, useRef } from "react";
import Effect from "./Effect";
import { SSGIEffects } from "./r3f-gist/effect/RealisticEffect";
import { EffectComposer } from "@react-three/postprocessing";

extend({ TextGeometry: TextGeometry })
export default function App() {

    return <>
        <Canvas
            shadows
            camera={{
                fov: 20,
                near: 0.1,
                far: 200,
                position: [0, 0, 5]
            }}
            gl={{ preserveDrawingBuffer: true }}
        >
            <color attach={'background'} args={['#000000']} />

            <OrbitControls makeDefault />

            {/* <mesh castShadow receiveShadow >
                <Geometry>
                    <Base>
                        <boxGeometry args={[10, 1, 1]} />
                    </Base>

                    <Subtraction position={[0, 0, 0.3]}>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial />
                    </Subtraction    >
                </Geometry>
                <meshStandardMaterial />
            </mesh> */}

            <mesh rotation={[Math.PI * -0.5, 0, 0]} scale={[5, 5, 5]} receiveShadow castShadow>
                <planeGeometry />
                <meshStandardMaterial />
            </mesh>

            <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
                <boxGeometry />
                <meshStandardMaterial />
            </mesh>

            <directionalLight position={[1, 2, 0]} castShadow intensity={5} />

            <Environment preset="city" />
            <Effect />



            <Utilities />

        </Canvas>
    </>
}