import './homepage.css';

const data = {
    total_case :23273,
    total_death :909,
    active_cases :151,
    local_quired_7_days :3,
    test_last_24_hours :23273,
    local_quired_24_hours :0,
    foreign_quired_24_hours :66,
    total_hospitalized : 234,
    total_vaccinations :1526,
    nsw_vaccinations :164,
    vic_vaccinations :341,
    qld_vaccinations :795,
    wa_vaccinations :225,
    act_vaccinations :696,
    sa_vaccinations :769,
    nt_vaccinations :225,
};
const Homepage =() => {
    return(
        <div>
            <div style =  {{backgroundColor: '#FDC500'}}> 
                <h1 className='homepage_title'> COVID Guard homepage </h1>
            </div>

            <div className='homepage_text_one'>
                <text>COVID-19 Statistics summary</text>
                <div style= {{width:'100%',height:'10px'}}> </div>
            </div>
            <div className='box_one'> 
                
                <text >Total case </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.total_case}</text>
            </div>
            
            <div className='box_two'>
                <text> Total death </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.total_death}</text>
            </div>

            <div className='box_three'>
                <text> Active Cases </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.active_cases}</text>
            </div>

            <div className='box_four'>
                <text>Locally quired in the last 7 days </text>
                <div style= {{width:'100%',height:'0.5px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.local_quired_7_days}</text>
            </div>
            
            <div className='box_five'> 
                
                <text >Test in the last 24 hours </text>
                <div style= {{width:'100%',height:'0.5px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.test_last_24_hours}</text>
            </div>

            <div className='box_six'> 
                <text >Locally quired in the last 24 hours </text>
                <div style= {{width:'100%',height:'0.5px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.local_quired_24_hours}</text>
            </div>

            <div className='box_seven'> 
                <text >Foreign quired in the last 24 hours </text>
                <div style= {{width:'100%',height:'0.5px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.foreign_quired_24_hours}</text>
            </div>

            <div className='box_eight'> 
                <text >Total hospitalized </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.total_hospitalized}</text>
            </div>

            <div className='homepage_text_two'>
                <text>COVID-19 Vaccine statistics summary</text>
                <div style= {{width:'100%',height:'10px'}}> </div>
            </div>

            <div className='box_nine'> 
                
                <text >Total vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.total_vaccinations}</text>
            </div>

            <div className='box_ten'> 
                
                <text >NSW vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.nsw_vaccinations}</text>
            </div>

            <div className='box_eleven'> 
                
                <text >VIC vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.vic_vaccinations}</text>
            </div>

            <div className='box_twelve'> 
                
                <text >QLD vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.qld_vaccinations}</text>
            </div>

            <div className='box_thirteen'> 
                
                <text >WA vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.wa_vaccinations}</text>
            </div>

            <div className='box_fourteen'> 
                
                <text >ACT vaccinations</text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.act_vaccinations}</text>
            </div>

            <div className='box_fifteen'> 
                
                <text >SA vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.sa_vaccinations}</text>
            </div>

            <div className='box_sixteen'> 
                
                <text >NT vaccinations </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
                <text style = {{fontSize:'25px',fontWeight:'400'}}>{data.nt_vaccinations}</text>
            </div>


        </div>
    );
}

export default Homepage;