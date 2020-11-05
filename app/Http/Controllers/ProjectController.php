<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Project;

class ProjectController extends Controller
{
    //データ一覧表示
    public function show(){
        $projects = Project::all();
        //dd($projects);
        return response()->json(['getProjectList'=>$projects]);
    }

    //データ登録
    public function regist(Request $request){
        $projects = new Project;
        $projects->project = $request->addProject;
        $projects->save();
        return response()->json(['regist'=>$projects]);
    }

    //プロジェクトの編集
    public function edit(Request $request){
        $project = Project::find($request->editId);
		if($project){
			$project->project = $request->input('addProject');
        }
        $project->save();
        return response()->json(['edit'=>$project]);
    }

	//プロジェクト削除
	public function destroy($id){
		$project = Project::find($id);
		if($project){
			$res = $project->delete();
		}
		return response()->json(['delete'=>$res]);
	}
}
