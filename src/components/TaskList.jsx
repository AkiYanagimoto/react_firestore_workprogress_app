import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import InputTaskForm from './InputTaskForm';

const TaskList = props => {

    //useState宣言
    const [taskList, setTaskList] = useState(null);
    const [dayWorkList, setDayWorkList] = useState(null);

    const getTaskFromFirestore = async () => {
        const taskListArray = await firebase.firestore()
            .collection('tasks')
            .get();

        // 各タスクに紐づけられたprojectとday_workを取得
        const taskArray = await Promise.all(taskListArray.docs.map(async (x) => {

            // タスクに紐づけられたプロジェクトIDを取得
            let projectId = x.data().projectRef.id;

            // IDでfirestoreからprojectドキュメントを取得
            const projectDetail = await firebase.firestore()
                .collection('projects')
                .doc(projectId)
                .get();

            // IDでfirestoreからday_workドキュメントを取得
            let taskId = x.id; // タスクID
            // タスクが関連づけられた1日の作業リストを取得
            const taskRefPath = firebase.firestore().doc('tasks/' + taskId)
            const dayWorkListArray = await firebase.firestore()
                .collection('day_work')
                .where('taskRef', '==', taskRefPath)
                .get()

            // リストから集計したものをタスク全体の作業時間として登録したいが、未完成・・・

            // 作業時間数の合計
            const whSum = dayWorkListArray.docs.reduce((sum, i) => sum + Number(i.data().whActual), 0);

            // tasksのwhDoneを更新する
            const updatedTaskWh = await firebase.firestore()
                .collection('tasks')
                .doc(taskId)
                .update({
                    whDone: whSum,
                });

            // もう一度tasksリストの更新をしてあげないといけない?

            return {
                id: x.id,
                data: x.data(),
                projectDetail: projectDetail.data(),
            }
        }))

        setTaskList(taskArray);
        return taskArray;
    }

    useEffect(() => {
        const result = getTaskFromFirestore();
    }, [props])

    const tableStyle = { borderCollapse: "collapse", margin: "4px 0", minWidth: "750px" };
    const thStyle = { padding: "4px", border: "1px solid #888" };
    const tdStyle = { padding: "4px", border: "1px solid #888", textAlign: "center" }

    return (
        <div>
            <h2>タスクリスト</h2>
            <h3>新規登録</h3>
            <InputTaskForm
                getTaskFromFirestore={getTaskFromFirestore}
            />
            <h3>リスト</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>タスク名</th>
                        {/* <th style={thStyle}>ステータス</th> */}
                        <th style={thStyle}>締切り</th>
                        <th style={thStyle}>見積り工数</th>
                        <th style={thStyle}>作業済</th>
                        <th style={thStyle}>プロジェクトリファレンス</th>
                        <th style={thStyle}>チェック</th>
                        <th style={thStyle}>削除</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        taskList?.map((x, index) =>
                            <tr key={index} id={x.id}>
                                <td style={tdStyle}>
                                    <p>{x.data.task}</p>
                                </td>
                                {/* <td style={tdStyle}>
                                    <p>{x.data.status}</p>
                                </td> */}
                                <td style={tdStyle}>
                                    <p>{x.data.deadline}</p>
                                </td>
                                <td style={tdStyle}>
                                    <p>{x.data.whTarget} &nbsp;WH</p>
                                </td>
                                <td style={tdStyle}>
                                    <p>{x.data.whDone} &nbsp;WH</p>
                                </td>
                                {/* <td style={tdStyle}>
                                    <p>WH Rest:{x.data.whRest}</p>
                                </td>
                                <td style={tdStyle}>
                                    <p>WH Extra:{x.data.whExtra}</p>
                                </td>
                                <td style={tdStyle}>
                                    <p>WH Total:{x.data.whTotal}</p>
                                </td> */}
                                <td style={tdStyle}>
                                    <p>{x.projectDetail.project}</p>
                                </td>
                                <td style={tdStyle}>
                                    <input type="checkbox" value={x.id} />
                                </td>
                                <td style={tdStyle}>
                                    <button value={x.id}>delete</button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            {/* <ul>
                {
                    taskList?.map((x, index) =>
                        <li key={index} id={x.id}>
                            <input type="checkbox" value={x.id} />
                            <button value={x.id}>delete</button>
                            <p>Task:{x.data.task}</p>
                            <p>Status:{x.data.status}</p>
                            <p>Deadline:{x.data.deadline}</p>
                            <p>Created at:{x.data.created_at}</p>
                            <p>WH Target:{x.data.whTarget}</p>
                            <p>WH Done:{x.data.whDone}</p>
                            <p>WH Rest:{x.data.whRest}</p>
                            <p>WH Extra:{x.data.whExtra}</p>
                            <p>WH Total:{x.data.whTotal}</p>
                            <p>WH Project:{x.data.projectRef}</p>
                        </li>
                    )
                }
            </ul> */}
        </div>
    )


}

export default TaskList;