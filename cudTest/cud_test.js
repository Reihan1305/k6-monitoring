import http from "k6/http";
import { check } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

export const options = {
  stages: [
    { duration: "1m", target: 5000 }, 
    { duration: "10m", target: 7000 },
    { duration: "1m", target: 0 },     
  ],
};

export default function () {
  const createPayload = JSON.stringify({
    title: `Test title ${uuidv4()}`,
    content: `This is content for post ${uuidv4()}`
  });

  const resCreate = http.post("http://api:8080/api/post", createPayload, {
    headers: { "Content-Type": "application/json" }
  });

  check(resCreate, {
    "status is 201 created": (r) => r.status === 201,
  });

  const postId = resCreate.json().data.post.id;

  const updatePayload = JSON.stringify({
    title: `Updated title ${uuidv4()}`,
    content: "Updated content"
  });

  const resUpdate = http.patch(`http://api:8080/api/post/${postId}`, updatePayload, {
    headers: { "Content-Type": "application/json" }
  });

  check(resUpdate, {
    "status is 200 updated": (r) => r.status === 200,
  });

  const resDelete = http.del(`http://api:8080/api/post/${postId}`);

  check(resDelete, {
    "status is 204 deleted": (r) => r.status === 204,
  });
}
