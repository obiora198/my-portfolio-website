import { getUserSession } from "./userSession";


type ProjectProps = {
  title: string
  description: string
  image: string
  link: string
};

const getUser = async () => {
  const res = await getUserSession();
  return res;
};

export default async function createProject({title,description,image,link}: ProjectProps) {
  try {
    const user = await getUser();
    const response = await fetch(
      "https://my-portfolio-api-1v51.onrender.com/api/v1/projects",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          images: [image],
          link: link,
        }),
      }
    );

    // Handle response if necessary
    if (response.status === 201) {
      const data = await response.json();
      console.log(data);
    } else {
      await fetch(
        "https://my-portfolio-api-1v51.onrender.com/api/v1/projects/delete-image",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            images: [image],
          }),
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
}
