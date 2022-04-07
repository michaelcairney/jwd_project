import { useEffect, useState } from 'react';

export default function useEnigma(doc, objectId) {
  const [qlikData, setQlikData] = useState(null);

  useEffect(() => {
    if (doc) {
      // Function for extracting the data from the qlik engine
      const getData = async () => {
        // Get object using it's ID
        const qObject = await doc.getObject(objectId);

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
      getData();
    }
  }, [doc, objectId]);

  return { qlikData };
}
