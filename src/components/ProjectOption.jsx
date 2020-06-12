import React, { useState, useEffect } from 'react';
import firebase from '../firebase';

const ProjectOption = (props) => {

    const [projectOption, setProjectOption] = useState(null);

    // firebaseからデータを取得してstateに格納する関数
    const getProjectsFromFirestore = async () => {
        const projectListArray = await firebase.firestore()
            .collection('projects')
            .get();
        console.log(projectListArray.docs);

        const projectArray = projectListArray.docs.map(x => {
            return {
                id: x.id,
                data: x.data(),
            }
        })
        setProjectOption(projectArray);
        return projectArray;
    }

    useEffect(() => {
        const result = getProjectsFromFirestore();
    }, [props])

    return projectOption;
    //     (
    //     projectOption
    //     <>
    //         <label htmlFor="projectRef">プロジェクトリファレンス</label>
    //         <select id="projectRef">
    //             {
    //                 ?.map((x, index) =>
    //                     <option value={x.id} onChange={e => setProjectRef(e.target.value)}>{x.data.project}</option>
    //                 )
    //             }
    //         </select>
    //     </>

    // );
}
export default ProjectOption;