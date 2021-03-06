import dateFormat from 'dateformat';

const handleQuery = (ref, numData) => {
  // Fetch query of given reference
  return new Promise((resolve, reject) => {
    ref.limit(numData).get().then((documentSnapshots) => {



      let i = 0;
      var tmp_data = []
      documentSnapshots.forEach((doc) => {

        tmp_data.push({
          "post_index": i++,
          "id": doc.id,
          "title": doc.data().title,
          "link": doc.data().link,
          "author": doc.data().author,
          "published": dateFormat(doc.data().published.toDate(), "mediumDate"),
          "isLoading": false,
          "tags": doc.data().tags === undefined ? [] : doc.data().tags
        });
      });

      // Build a reference for next page
      const lastVisible = documentSnapshots.docs[documentSnapshots.size - 1];
      // console.log("lastVisible", lastVisible)


      const pageEnding = documentSnapshots.size < numData ? true : false;
      const isNotFound = !lastVisible ? true : false;
      const refNext = isNotFound ? null : ref.startAfter(lastVisible)

      resolve({
        data: tmp_data,
        refNext: refNext,
        pageEnding: pageEnding,
        isNotFound: isNotFound
      });

    })
      .catch(function (err) {
        reject(err);
        throw Error('Query error', err);
      });
  })
}

const getData = async (num_data, refNext, refInitQuery) => {

  try {
    let currentData;
    // No prefetch data, then get current page
    if (refNext === null) {
      // Perform query from first query (first visible)
      currentData = handleQuery(refInitQuery, num_data);
    } else {
      // Perform query from last visible page
      currentData = handleQuery(refNext, num_data);
    }

    return currentData;

  } catch (e) {
    throw Error('Query error', e);
  }
}

export default getData;
