import React, { useState, useEffect } from 'react';
import firebase from '../firebase';

const InputTaskForm = ({ getTaskFromFirestore }) => {

    const [projectList, setProjectList] = useState(null);

    const getProjectFromFirestore = async () => {
        const projectListArray = await firebase.firestore()
            .collection('projects')
            .get();

        const projectArray = projectListArray.docs.map(x => {
            return {
                id: x.id,
                data: x.data(),
            }
        })

        setProjectList(projectArray);
        return projectArray;
    }

    useEffect(() => {
        const result = getProjectFromFirestore();
    }, [])

    // console.log(projectList);

    let getdate = new Date();
    let yymmdd = getdate.getFullYear()
        + '/' + ('0' + (getdate.getMonth() + 1)).slice(-2)
        + '/' + ('0' + getdate.getDate()).slice(-2)

    // useState宣言
    const [projectRef, setProjectRef] = useState('');
    const [task, setTask] = useState('');
    const [deadline, setDeadline] = useState(yymmdd);
    const [whTarget, setWhTarget] = useState('');

    // firestoreにデータを送信する関数
    const postDataToFirestore = async (collectionName, postData) => {
        const addedData = await firebase.firestore()
            .collection(collectionName)
            .add(postData);
        return addedData;
    }

    // submitボタンクリック時の処理
    const submitData = async () => {
        if (projectRef === '' || task === '' || deadline === '' || whTarget === '') { console.log('X') };

        const postData = {
            // projectRef: projectRef,
            projectRef: firebase.firestore().doc(projectRef),
            task: task,
            deadline: deadline,
            status: 0,
            whTarget: whTarget,
            whDone: 0,
            whRest: 0,
            whTotal: 0,
            whExtra: 0,
        }
        console.log(postData);

        const addedData = await postDataToFirestore('tasks', postData);
        setProjectRef('');
        setTask('');
        setDeadline('');
        setWhTarget('');
        getTaskFromFirestore('');
    }

    return (
        <div>
            <form action="">
                <ul>
                    <li>
                        <label htmlFor="projectRef">プロジェクト名</label>
                        <select id="projectRef" onChange={e => setProjectRef(e.target.value)}>
                            {
                                projectList?.map((x, index) =>
                                    <option
                                        key={index}
                                        id="projectRef"
                                        value={"/projects/" + x.id}
                                        onChange={e => setProjectRef(e.target.value)}
                                    >
                                        {x.data.project}
                                    </option>
                                )
                            }
                        </select>
                    </li>
                    <li>
                        <label htmlFor="task">タスク名</label>
                        <input
                            type="text"
                            id="task"
                            value={task}
                            onChange={e => setTask(e.target.value)}
                        />
                    </li>
                    <li>
                        <label htmlFor="deadline">締切り</label>
                        <input
                            type="text"
                            id="deadline"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                        />
                    </li>
                    <li>
                        <label htmlFor="whTarget">見積り作業工数</label>
                        <input
                            type="number"
                            id="whTarget"
                            value={whTarget}
                            onChange={e => setWhTarget(e.target.value)}
                        />
                    </li>
                    <li>
                        <button
                            type="button"
                            onClick={submitData}
                        //onClick={() => console.log('click')}
                        >Submit</button>
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default InputTaskForm;