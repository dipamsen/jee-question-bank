const API_URL = import.meta.env.VITE_API_URL;
function getChapters(subject: any) {
  return fetch(`${API_URL}chapters?subject=${subject}`).then((response) =>
    response.json()
  );
}

function getCompStatus() {
  return fetch(`${API_URL}compStatus`).then((response) => response.json());
}

export { getChapters, getCompStatus };
