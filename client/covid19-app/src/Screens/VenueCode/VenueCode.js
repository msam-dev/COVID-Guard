
const data={
    venue_code: 'C51A9'
};
const VenueCode =() => {
    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>My Venue Code</h1>
            </div>
            

            
            <div>
                <h1 style={{marginTop:"5%" ,textAlign:'Center',fontWeight:'normal',fontSize:'20px',color: "#0E5F76"}}>
                    <span >Please print the contents of this page</span>
                    <br/>
                    <span >Crop as necessary</span> 
                    
                </h1>
            </div>

            <div style={{width:"100%",height:'30px'}} >   </div>

            <div style={{color: "#0E5F76",backgroundColor: "#FDC500",fontSize:'20px',textAlign:'Center',padding:'10px'}}>
                    <span >Help stop the spread. Please go to the following web</span>
                    <br/>
                    <span >page and enter the code shown below. Create an</span> 
                    <br/>
                    <span>account for faster sign in next time.</span>
                    <br/>
                    <span style={{fontSize:'32px',fontWeight:'bolder',margin:'10px'}}>www.COVIDGuard.com</span>
            </div>

            <div style={{fontSize:'40px',textAlign:'center',padding:'15px'}}>
                <text> {data.venue_code}</text>
            </div>

        </div>
    );
}

export default VenueCode;