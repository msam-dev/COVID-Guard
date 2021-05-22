import './homepage.css';
import { useEffect, useState } from 'react';
import { _homepageStatas } from '../../_helpers/endPoints';


const Homepage =() => {

    const [HomeInfo, setHomeInfo] = useState({covidSummary:{
        totalHospitalised:47, // scraped
        totalDeaths:910, // scraped
        totalTests:17094636, // scraped
        totalTestsLast24Hours:13815, // scraped
        totalOverseasCasesLast24Hours:7, // scraped
        totalCurrentHotspotVenues:2,
        totalPositiveCasesLast24Hours:0,
        totalPositiveCases:192
     },
     checkinsSummary:{
        totalCheckins:590085,
        checkinsLast24Hours:0
     },
     businessesSummary:{
        totalBusinessesRegistered:501
     },
     vaccinationsSummary:{
        vaccinationsYesterday:0,
        totalVaccinations:1619
     },
     usersSummary:{
   totalRegisteredGeneralPublicUsers:9884
     }
});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    
    useEffect(() => {
        setLoading(true);

        _homepageStatas()
        .then(res => {
             setHomeInfo(res.data.stats);
             setLoading(false);
           
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            
        })
    } );

    
    const data = {
        total_case :32 ,
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



    return(
        <div className='container'>
            <div style =  {{backgroundColor: '#FDC500'}}> 
                <h1 style={{color: '#0E5F76'}}> COVID Guard homepage </h1>
            </div>
          <div className='home_flex'>
            <div className='homepage_text_one'>
                <text>COVID-19 Statistics summary</text>
                <div style= {{width:'100%',height:'10px'}}> </div>
            </div>
            <div className='box_one'> 
                
                <text >Total case </text>
                <div style= {{width:'100%',height:'20px'}}> </div>
               { loading 
               ?
               <div>
               </div>
               :
               <text style = {{fontSize:'25px',fontWeight:'400'}}>{HomeInfo.covidSummary.totalPositiveCases}</text>
                }
                
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

            {/*
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
            */}
          </div>

        </div>
    );
}

export default Homepage;