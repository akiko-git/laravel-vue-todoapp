<template>
	<div>
			<v-navigation-drawer
				v-model="drawer"
				app
				clipped
			>
				<v-list>
					<v-list-item>
						<v-list-item-icon>
							<v-icon>mdi-home</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item>	
					<v-list-group @mouseover="mouseOverAction" @mouseleave="mouseLeaveAction">
						<template v-slot:activator>
							<v-list-item-content>
								<v-list-item-title class="iconPotision">プロジェクト</v-list-item-title>
								<!--<i v-if="hoverFlag" class="fas fa-plus"></i>-->
								<i v-if="hoverFlag" class="fas fa-plus" @click="addProject"></i>
							</v-list-item-content>
						</template>
						<v-list-item
						 v-for="(pro,i) in pros"
						 :key="i"
						 link
						>
							<v-list-item-title v-text="pro[0]"></v-list-item-title>
						</v-list-item>
					</v-list-group>
				</v-list>
			</v-navigation-drawer>
			<v-app-bar
			  class="indigo"
				fixed
				app
				dark
				clipped-left
			>
				<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
				<v-toolbar-title>Title</v-toolbar-title>				
			</v-app-bar>

		</div>	
</template>

<script>
	export default {
		data:()=> ({
			drawer:null,
			pros:[
				['お知らせ'],
			],
			hoverFlag: false,
		}),
		methods:{
			mouseOverAction(){
        this.hoverFlag = true
      },
      mouseLeaveAction(){
        this.hoverFlag = false
      },
			addProject(){
				alert("add!!!")
			}
		},

	}

</script>
<style>
	.iconPotision{
 		position: relative;
    margin-left: 20px;
	}
	.fa-plus {
		position: absolute;
		top: 15px;
	}

</style>
