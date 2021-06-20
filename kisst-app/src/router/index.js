import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/:db',
        name: 'Home',
        component: Home
    }
];

const router = createRouter({
    /** @todo this makes me angry */
    history: createWebHistory(''),
    routes
});

export default router;