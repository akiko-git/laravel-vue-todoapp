<template>
	<v-footer padless class="indigo mt-16">
		<v-row justify="center">
			<v-btn v-for="link in links" :key="link" color="white" text class="my-2">
				{{ link }} 
			</v-btn>
			<v-col class="indigo lighten-2 py-4 text-center white--text" cols="12">
				{{ new Date().getFullYear() }}
			</v-col>
		</v-row>
	</v-footer>
</template>

<script>
	export default {
		data:()=>({
			links:[
				'Home',
			],
		}),

	}
</script>
<style>
.v-footer{z-index:1000;}
</style>
