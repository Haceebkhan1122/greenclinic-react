import { Dropdown } from "react-bootstrap";
import { FaStethoscope } from "react-icons/fa"; 

const CustomDropdown = () => {
    return (
        <div className="filter-by-div">
            <Dropdown>
                <Dropdown.Toggle variant="light" className="filter">
                    <span className="linkIcon" style={{ color: "blue", marginRight: 5 }} />
                    All Doctors
                    <span className="arrowIcon" style={{ color: "blue", marginRight: 5 }} />
                </Dropdown.Toggle>
                {/* <Dropdown.Menu>
                    <Dropdown.Item className="dropItemCustom" >All Doctors</Dropdown.Item>
                </Dropdown.Menu> */}
            </Dropdown>
        </div>
    );
};

export default CustomDropdown;