import React, {useState, useEffect} from "react";
import axios from "axios";

export default ()=> {

    const [index, setIndex] = useState('')
    const [values, setvalues] = useState({})
    const [seenIndex, setSeenIndex] = useState([])

    useEffect(()=>{
        fetchValues()  
        fetchIndexes()
    },[])

    const fetchValues = async ()=>{
        const values_ = await axios.get('/api/values/current')
        setvalues(values_.data || [])
    }

    const fetchIndexes = async ()=>{
        const seenIndex_ = await axios.get('/api/values/all')
        setSeenIndex(seenIndex_.data || []) 
    }

    const handleSubmit = async e => {
        e.preventDefault()
        await axios.post('/api/values', {
            value:index
        })

        setIndex('')
    }

    const renderSeenIndexes = ()=>{
        return seenIndex.map(({number})=> number ).join(', ')
    }

    const renderValues = ()=>{
        const entries = []

        for (let key in values) {
            entries.push(
                <div key={key}>
                    For Index {key} I calcculated {values[key]}
                </div>
            )
        }

        return entries
    }


    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <lable>Enter Your index:</lable>
                <input
                    value={index}
                    onChange={e=>setIndex(e.target.value)}
                />
                <button>submit</button>
            </form>

            <h3>Indexes I have Seen</h3>
            {renderSeenIndexes()}

            <h3>Calculated values</h3>
            {renderValues()}
        </div>
    )


}