
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { EffectComposer, EffectPass, FXAAEffect, RenderPass, ToneMappingEffect } from "postprocessing";
import { useEffect, useState } from "react";
import { HBAOEffect, SSGIEffect, VelocityDepthNormalPass } from "realism-effects";


export default function Effect() {
    const gl = useThree((state) => state.gl)
    const scene = useThree((state) => state.scene)
    const camera = useThree((state) => state.camera)
    const size = useThree((state) => state.size)
    const [composer] = useState(() => new EffectComposer(gl, { multisampling: 0 }))

    function updateProperty(value, prop) {
        if (composer.passes.length > 0) {
            const effect = composer.passes[3].effects[0]
            const name = prop.split('.').pop()
            effect[name] = value
        }
    }
    const config = useControls('SSGI', {
        importanceSampling: { value: true, onChange: updateProperty },
        distance: { value: 5.98, min: 0.001, max: 50, onChange: updateProperty },
        thickness: { value: 2.83, min: 0, max: 10, onChange: updateProperty },
        envBlur: { value: 0, min: 0, max: 1, onChange: updateProperty },

        denoiseIterations: { value: 1, min: 0, max: 5 },
        radius: { value: 11, min: 0, max: 32, onChange: updateProperty },

        phi: { value: 0.875, min: 0, max: 1, onChange: updateProperty },
        depthPhi: { value: 23.37, min: 0, max: 50, onChange: updateProperty },
        normalPhi: { value: 26.0, min: 0, max: 50, onChange: updateProperty },
        roughnessPhi: { value: 18.48, min: 0, max: 50, onChange: updateProperty },
        lumaPhi: { value: 20.652, min: 0, max: 50, onChange: updateProperty },
        specularPhi: { value: 7.1, min: 0, max: 50, onChange: updateProperty },

        missedRays: { value: false, onChange: updateProperty },
        steps: { value: 20, min: 1, max: 50, onChange: updateProperty },
        refineSteps: { value: 4, min: 1, max: 50, onChange: updateProperty },
    })

    useEffect(() => composer.setSize(size.width, size.height), [composer, size])


    useEffect(() => {
        const renderPass = new RenderPass(scene, camera)
        const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera)

        // ssgi
        const ssgi = new SSGIEffect(scene, camera, velocityDepthNormalPass, config)

        //hbao
        const hbao = new HBAOEffect(composer, camera, scene)

        const effectPass = new EffectPass(camera, ssgi)
        composer.addPass(renderPass)
        composer.addPass(velocityDepthNormalPass)
        composer.addPass(effectPass)
        composer.addPass(new EffectPass(camera, new FXAAEffect()), new ToneMappingEffect())

        return () => {
            composer.removeAllPasses()
        }
    }, [composer, scene, camera])

    useFrame((state, delta) => {
        gl.autoClear = true
        composer.render(delta)
    }, 1)
}