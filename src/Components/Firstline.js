import React, { useEffect, useState } from 'react'


export default function FirstLine(props) {
    const [groupTitle, setTitle] = useState('Загрузка...')

    useEffect(() => {
        setTitle(props.groupTitle)
    }, [props.groupTitle])


    if (!groupTitle) {
        return 'Загрузка...'
    }

    return groupTitle
}


{/* <span>{this.state.userName}</span>
<Button variant="outlined" color="primary" onClick={this.handleClick}>
  {title}
</Button> */}
