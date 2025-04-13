export default async function fetchProjects() {
   try {
     const response = await fetch('/api/projects')
     const data = await response.json()
    //  console.log(data.data)
     return(data.data)
   } catch (e) {
     console.log(e)
   }
}
