import React, { useState } from 'react';
import firebase from '../firebase';

const DayWork = ({ index, dayWork, getDayWorkFromFirestore }) => {

    const [whDoneToday, setWhDoneToday] = useState(dayWork.data.whActual);
    const [taskId, setTaskId] = useState(dayWork.data.taskRef.id);
    const [taskWhList, setTaskWhList] = useState(null);

    let whDone = dayWork.taskDetail.whDone;

    const sendWhActualOnFirestore = async (collectionName, documentId) => {
        if (whDoneToday === '') { return false };

        let today = dayWork.data.date;
        const postData = {
            whActual: Number(whDoneToday),
        }

        const updateWhActual = await firebase.firestore()
            .collection(collectionName)
            .doc(documentId)
            .update(postData);

        // // 同じタスクが関連づけられた工数の合計を取得したい
        // const taskRefId = firebase.firestore().doc('tasks/' + taskId)
        // // 同じタスクが関連づけられた1日の作業リストを取得
        // const taskWhListArray = await firebase.firestore()
        //     .collection(collectionName)
        //     .where('taskRef', '==', taskRefId)
        //     .get()

        // // リストから集計したものをタスク全体の作業時間として登録したいが、未完成・・・
        // const taskWhArray = taskWhListArray.docs.map(x => {

        //     return {
        //         whActual: Number(x.data().whActual),
        //     }
        // })
        // const whTotal = taskWhArray.reduce((p, x) => p + x.whActual, 0)
        // const updatedData = await firebase.firestore()
        //     .collection('tasks')
        //     .doc(taskId)
        //     .update({
        //         whDone: whTotal,
        //     });

        getDayWorkFromFirestore();
        return;
    }

    const deleteDataOnFirestore = async (collectionName, documentId) => {
        const removedData = await firebase.firestore()
            .collection(collectionName)
            .doc(documentId)
            .delete();
        getDayWorkFromFirestore();
        return
    }

    // const iconDone = "＊ ";
    // const workProgress = iconDone.repeat(whDone)
    // const iconTarget = "＿ ";
    // const workTarget = iconTarget.repeat(dayWork.taskDetail.whTarget)

    const tableStyle = { borderCollapse: "collapse", margin: "4px 0", minWidth: "750px" };
    const thStyle = { padding: "4px", border: "1px solid #888" };
    const tdStyle = { padding: "4px", border: "1px solid #888", textAlign: "center" }

    return (
        <div>
            {
                dayWork === null
                    ? <p>no data...</p>
                    : <div>
                        <h3> {dayWork.taskDetail.task} </h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>優先度</th>
                                    <th style={thStyle}>前日迄の進捗</th>
                                    <th style={thStyle}>締切り</th>
                                    <th style={thStyle}>今日の作業予定時間</th>
                                    <th style={thStyle}>実際の作業時間</th>
                                    <th style={thStyle}>作業報告</th>
                                    <th style={thStyle}>削除</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={index} id={dayWork.id}>
                                    <td style={tdStyle}>
                                        {dayWork.data.priority}
                                    </td>
                                    <td style={tdStyle}>
                                        {whDone}/{dayWork.taskDetail.whTarget}&nbsp;WH
                        </td>
                                    <td style={tdStyle}>
                                        {dayWork.taskDetail.deadline}
                                    </td>
                                    <td style={tdStyle}>
                                        {dayWork.data.whEstimate}&nbsp;WH
                        </td>
                                    <td style={tdStyle}>
                                        {dayWork.data.whActual}&nbsp;WH
                        </td>
                                    <td style={tdStyle}>
                                        {/* <input
                                type="checkbox"
                                value={dayWork.id}
                                checked={dayWork.data.isDone}
                                onChange={e => updateDataOnFirestore('day_work', dayWork.id, dayWork.data.isDone)}
                            /> */}

                                        <form action="">
                                            <ul style={{ listStyle: "none" }}>
                                                <li>
                                                    <label htmlFor="whActual">作業時間</label>
                                                    <input
                                                        type="number"
                                                        id={index}
                                                        value={whDoneToday}
                                                        onChange={e => setWhDoneToday(e.target.value)}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        id="taskRef"
                                                        value={taskId}
                                                        onLoad={e => setTaskId(e.target.value)}
                                                    />
                                                </li>
                                                <li>
                                                    <button
                                                        type="button"
                                                        id={dayWork.index}
                                                        // value={dayWork.id}
                                                        // onClick={sendWhActualOnFirestore}
                                                        onClick={e => sendWhActualOnFirestore('day_work', dayWork.id)}
                                                    >今日の作業時間として報告する</button>
                                                </li>
                                            </ul>
                                        </form>
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            id="deleteBtn"
                                            value={dayWork.id}
                                            onClick={e => deleteDataOnFirestore('day_work', dayWork.id)}
                                        >削除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            }
        </div>


        // <li key={index} id={dayWork.id}>
        //     <input
        //         type="checkbox"
        //         value={dayWork.id}
        //         checked={dayWork.data.isDone}
        //         onChange={e => updateDataOnFirestore('day_work', dayWork.id, dayWork.data.isDone)}
        //     />
        //     <button
        //         id="deleteBtn"
        //         value={dayWork.id}
        //         onClick={e => deleteDataOnFirestore('day_work', dayWork.id)}
        //     >削除</button>
        //     {/* <p>プロジェクト名：{dayWork.projectDetail.project_name}</p>
        //                     <p>プロジェクトカラー：{dayWork.projectDetail.color}</p>
        //                     <p>プロジェクトステータス：{dayWork.projectDetail.status}</p>
        //                     <p>プロジェクト時間：{dayWork.projectDetail.work_hour}</p> */}

        //     <p>タスク名：{dayWork.taskDetail.task}</p>
        //     <p>タスクステータス：{dayWork.taskDetail.status}</p>
        //     <p>タスク締め切り：{dayWork.taskDetail.deadline}</p>
        //     <p>
        //         done{dayWork.taskDetail.whDone}/
        //                         extra{dayWork.taskDetail.whExtra}/
        //                         rest{dayWork.taskDetail.whRest}/
        //                         target{dayWork.taskDetail.whTarget}/
        //                         total{dayWork.taskDetail.whTotal}
        //     </p>
        //     <p>作業優先度：{dayWork.data.priority}</p>
        //     <p>作業ステータス：{dayWork.data.status}</p>
        //     <p>今日の作業予定時間：{dayWork.data.whEstimate}</p>
        //     <p>作業報告：{dayWork.data.whActual}</p>
        //     <form action="">
        //         <ul>
        //             <li>
        //                 <label htmlFor="whActual">作業報告</label>
        //                 <input
        //                     type="number"
        //                     id={index}
        //                     value={whDoneToday}
        //                     onChange={e => setWhDoneToday(e.target.value)}
        //                 />
        //             </li>
        //             <li>
        //                 <button
        //                     type="button"
        //                     id={dayWork.index}
        //                     // value={dayWork.id}
        //                     // onClick={sendWhActualOnFirestore}
        //                     onClick={e => sendWhActualOnFirestore('day_work', dayWork.id)}
        //                 >報告</button>
        //             </li>
        //         </ul>
        //     </form>
        // </li>
    )
}
export default DayWork;