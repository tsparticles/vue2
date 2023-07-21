import Vue from "vue";
import particles from "./Particles.vue";

const VueParticles = {
    install: (vue: typeof Vue) => {
        vue.component("Particles", particles);
        vue.component("vue-particles", particles);
    },
};

export { particles as ParticlesComponent };
export default VueParticles;
