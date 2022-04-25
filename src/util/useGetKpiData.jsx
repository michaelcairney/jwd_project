import { useEffect, useState } from 'react';

export default function useGetQlikData(doc, objectId) {
  const [qlikData, setQlikData] = useState(null);

  useEffect(() => {
    if (doc) {
      // Get object using it's ID
      let qObject;
      doc.getObject(objectId).then((returnedObject) => {
        qObject = returnedObject;
        getData();
        qObject.on('changed', getData);
      });
      // Function for extracting the data from the qlik engine
      const getData = async () => {
        // Get layout to specify the data page width and height later on
        const layout = await qObject.getLayout();

        // Get the desired data
        const hyperCubeData = await qObject.getHyperCubeData(
          '/qHyperCubeDef',
          [
            {
              qTop: 0,
              qLeft: 0,
              qWidth: layout.qHyperCube.qSize.qcx,
              qHeight: layout.qHyperCube.qSize.qcy,
            },
          ],
        );
        setQlikData(hyperCubeData[0].qMatrix);
      };
    }
  }, [doc, objectId]);

  return { qlikData };
}
