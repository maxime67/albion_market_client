import { createRouter, createWebHistory } from 'vue-router';
import OreComponent from "@/components/OreComponent.vue";
import WoodComponent from "@/components/WoodComponent.vue";
import CottonComponent from "@/components/CottonComponent.vue";
import LeatherComponent from "@/components/LeatherComponent.vue";
import hideComponent from "@/components/HideComponent.vue";
import metalBarComponent from "@/components/MetalBarComponent.vue";
import clothComponent from "@/components/ClothComponent.vue";
import stoneBlockComponent from "@/components/StoneBlockComponent.vue";
import plankComponent from "@/components/PlankComponent.vue";
import StoneComponent from "@/components/StoneComponent.vue";
import itemCompleteComponent from "@/components/itemCompleteComponent.vue";

const routes = [
    { path: '/', component: OreComponent },
    { path: '/ore', component: OreComponent },
    { path: '/wood', component: WoodComponent },
    { path: '/Cotton', component: CottonComponent },
    { path: '/hide', component: hideComponent },
    { path: '/metalBar', component: metalBarComponent },
    { path: '/cloth', component: clothComponent },
    { path: '/stoneBlock', component: stoneBlockComponent },
    { path: '/planks', component: plankComponent },
    { path: '/stone', component: StoneComponent },
    { path: '/item', component: itemCompleteComponent },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;