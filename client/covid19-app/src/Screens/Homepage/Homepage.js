import { Carousel, Row, Col, Card, Divider } from 'antd';
import SydneyImage from '../../Assets/Images/Sydney.jpg';
import BrisbaneImage from '../../Assets/Images/Brisbane.jpg';
import MelbourneImage from '../../Assets/Images/Melbourne.jpg';
import { FireOutlined, FileDoneOutlined } from '@ant-design/icons';
import './Homepage.css';

const contentStyle = {
    height: '200px'
};
const style = { background: '#0092ff', padding: '10px 0' };


const Homepage = () => {

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%", marginBottom: '0px'}}>Home</h1>
            </div>
            <Carousel autoplay dotPosition="left" effect="fade">
                <div >
                    <div style={contentStyle}>
                        <img style={{width: '100%', height: '200px', minWidth: "1280px"}} src={SydneyImage} />
                    </div>
                </div>
                <div>
                    <div style={contentStyle}>
                        <img style={{width: '100%', height: '200px',minWidth: "1280px"}} src={BrisbaneImage} />
                    </div>
                </div>
                <div>
                    <div style={contentStyle}>
                        <img style={{width: '100%', height: '200px', minWidth: "1280px"}} src={MelbourneImage} />
                    </div>

                </div>
            </Carousel>
            <div style={{backgroundColor: "#0E5F76", height: '10px'}}/>
       

            <div className="homepage-section-banner" style={{marginBottom: '1%'}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "5%", marginBottom: '0px'}}>Business Summary</h1>
            </div>

            <Row  gutter={16}>
                <Col className="gutter-row" span={5} offset={1}>
                    <Card className="card-shadow-hoverable" title="0"  extra={<FireOutlined style={{fontSize: '20px', color: 'white'}}/>}  headStyle={{backgroundColor: '#0E5F76', color: 'white'}}>
                        <p>Businesses deemed a hotspot in the past 24 hours</p>
                        <div style={{backgroundColor: "#0E5F76", height: '5px', bottom: '0'}}/>
                    </Card>
                </Col>
                <Col  className="gutter-row" span={5}>
                    <Card className="card-shadow-hoverable" title="0"  extra={<FileDoneOutlined style={{fontSize: '20px', color: 'white'}}/>}  headStyle={{backgroundColor: '#0E5F76', color: 'white'}}>
                        <p>Total number of businesses registered</p>
                        <div style={{backgroundColor: "#0E5F76", height: '5px', bottom: '0'}}/>
                    </Card>
                </Col>
            </Row>
            <div className="homepage-section-banner" style={{marginBottom: '1%', marginTop: '1%'}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "5%", marginBottom: '0px'}}>Check-in Summary</h1>
            </div>
            <Row  gutter={16}>
                <Col className="gutter-row" span={5} offset={1}>
                    <Card className="card-shadow-hoverable" title="0"  extra={<FireOutlined style={{fontSize: '20px', color: 'white'}}/>}  headStyle={{backgroundColor: '#0E5F76', color: 'white'}}>
                        <p>Businesses deemed a hotspot in the past 24 hours</p>
                        <div style={{backgroundColor: "#0E5F76", height: '5px', bottom: '0'}}/>
                    </Card>
                </Col>
                <Col  className="gutter-row" span={5}>
                    <Card className="card-shadow-hoverable" title="0"  extra={<FileDoneOutlined style={{fontSize: '20px', color: 'white'}}/>}  headStyle={{backgroundColor: '#0E5F76', color: 'white'}}>
                        <p>Total number of businesses registered</p>
                        <div style={{backgroundColor: "#0E5F76", height: '5px', bottom: '0'}}/>
                    </Card>
                </Col>

                <Col className="gutter-row" span={5}>
                    <Card className="card-shadow-hoverable" title="0"  extra={<FireOutlined style={{fontSize: '20px', color: 'white'}}/>}  headStyle={{backgroundColor: '#0E5F76', color: 'white'}}>
                        <p>Businesses deemed a hotspot in the past 24 hours</p>
                        <div style={{backgroundColor: "#0E5F76", height: '5px', bottom: '0'}}/>
                    </Card>
                </Col>
                <Col  className="gutter-row" span={5}>
                    <Card className="card-shadow-hoverable" title="0"  extra={<FileDoneOutlined style={{fontSize: '20px', color: 'white'}}/>}  headStyle={{backgroundColor: '#0E5F76', color: 'white'}}>
                        <p>Total number of businesses registered</p>
                        <div style={{backgroundColor: "#0E5F76", height: '5px', bottom: '0'}}/>
                    </Card>
                </Col>
            </Row>

  

        </div>
    );
}

export default Homepage;