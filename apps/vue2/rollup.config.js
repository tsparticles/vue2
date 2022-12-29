import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';

export default [{
    input: 'src/components/Particles/Particles.vue',
    output: {
        format: 'esm',
        file: 'dist/particles.vue.js'
    },
    external: ['vue'],
    plugins: [
        typescript({
            //tsconfig: true//,
            // experimentalDecorators: true,
            // module: 'es2015'
        }),
        vue(),
        json()
    ]
},
    {
        input: 'src/components/Particles/Particles.vue',
        output: {
            format: 'esm',
            file: 'dist/particles.vue.min.js'
        },
        external: ['vue'],
        plugins: [
            typescript({
                //tsconfig: true//,
                // experimentalDecorators: true,
                // module: 'es2015'
            }),
            vue(),
            json(),
            terser()
        ]
    }];
