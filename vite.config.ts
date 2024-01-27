import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			//proxy websocket requests to your express server
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				ws: true,
			  },
		}
	}
});
