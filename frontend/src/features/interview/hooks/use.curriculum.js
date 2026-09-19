import { useContext } from 'react'
import { CurriculumContext } from '../context/curriculum.context'

export function useCurriculum() {
    return useContext(CurriculumContext)
}
