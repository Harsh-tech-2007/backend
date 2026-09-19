import { RouterProvider } from "react-router"
import { router } from "./app.route.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from './features/interview/interview.context.jsx'
import { CurriculumProvider } from './features/interview/context/curriculum.context.jsx'


function App() {

  return (
    <>
      <AuthProvider>
        <InterviewProvider>
          <CurriculumProvider>
            <RouterProvider router={router}></RouterProvider>
          </CurriculumProvider>
        </InterviewProvider>
      </AuthProvider>
    </>
  )
}

export default App
