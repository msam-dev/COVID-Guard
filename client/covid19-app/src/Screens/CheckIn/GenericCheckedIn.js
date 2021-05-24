
import { CheckCircleTwoTone } from '@ant-design/icons';

const GenericCheckedIn = () => {

    return(
        <div className = 'checkInMainContent' style={{maxWidth: '100%', color: '#0E5F76'}}>
        
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>CheckedIn</h1>
            </div> 
                <div style = {{textAlign: 'center', fontSize: '1.2rem'}}> <br/>
                    <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>  </h1>
                    
                    <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}><b>Checked-In Successfully</b></h1><br/>
                    <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '150px'}}/>
                </div>

        </div>                                                                      
    );
}

export default GenericCheckedIn;