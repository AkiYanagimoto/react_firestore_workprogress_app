import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import InputProjectForm from './InputProjectForm';
import Project from './Project';

const ProjectList = props => {

    // useStateの宣言 todoListにステート、それを更新するための関数のsetTodoList 初期値はuseStateの第一引数で指定
    const [projectList, setProjectList] = useState(null);

    // firebaseからデータを取得してstateに格納する関数
    const getProjectsFromFirestore = async () => {
        const itemListArray = await firebase.firestore()
            .collection('projects')
            .get();

        const projectArray = await Promise.all(itemListArray.docs.map(async (x) => {

            // IDでfirestoreからday_workドキュメントを取得
            let projectId = x.id; // タスクID
            console.log(projectId);

            // プロジェクトが関連づけられたタスクを取得
            const projectRefPath = firebase.firestore().doc('projects/' + projectId)
            const taskListArray = await firebase.firestore()
                .collection('tasks')
                .where('projectRef', '==', projectRefPath)
                .get()

            // リストから集計したものをタスク全体の作業時間として登録したいが、未完成・・・

            // 作業時間数の合計
            const whSum = taskListArray.docs.reduce((sum, i) => sum + Number(i.data().whDone), 0);
            console.log(whSum);

            // tasksのwhを更新する
            const updatedProjectWh = await firebase.firestore()
                .collection('projects')
                .doc(projectId)
                .update({
                    wh: whSum,
                });

            // もう一度リストの更新をしてあげないといけない気がする・・・

            return {
                id: x.id,
                data: x.data(),
            }
        }))
        setProjectList(projectArray);
        return projectArray;
    }

    useEffect(() => {
        const result = getProjectsFromFirestore();
    }, [props])

    const tableStyle = { borderCollapse: "collapse", margin: "4px 0", minWidth: "750px" };
    const thStyle = { padding: "4px", border: "1px solid #888" };

    return (
        <div>
            <h2>プロジェクトリスト</h2>
            <h3>新規登録</h3>
            <InputProjectForm
                getProjectsFromFirestore={getProjectsFromFirestore}
            />
            <h3>リスト</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>プロジェクト</th>
                        <th style={thStyle}>作業済</th>
                        {/* <th style={thStyle}>チェック</th> */}
                        <th style={thStyle}>削除</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        projectList?.map((x, index) =>
                            <Project
                                key={index}
                                project={x}
                                index={index}
                                getProjectsFromFirestore={getProjectsFromFirestore}
                            />
                        )
                    }
                </tbody>

            </table>
        </div>
    );
}

export default ProjectList;