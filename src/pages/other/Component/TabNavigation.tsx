import { useAuthContext } from '@/common';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const TabNavigation = () => {
    const location = useLocation();
    const { user } = useAuthContext();

    if (!user || !user?.roles) {
        return null;
    }
    const tabs = [
        { name: "Dashboard", link: "/dashboard", roles: ["BU Level", "Initiator", "SDG Owner", "Convener", "Stakeholder", "BU Head", "Convener L2"] },
        { name: "Add new note", link: "/AddProduct", roles: ["BU Level", "SDG Owner", "Initiator"] },
        { name: "New Notes Pending Circulation", link: "/PendingCirculation", roles: ["BU Level", "SDG Owner"] },
        { name: "Notes Pending Sign-Off", link: "/PendingSignoff", roles: ["SDG Owner", "Convener", "Stakeholder"] },
        { name: "Sign-off to be given by SDG Owner", link: "/SignedOffProductSGDOwner", roles: ["SDG Owner"] },
        { name: "Notes Pending Final Sign-Off", link: "/PendingFinalSignOff", roles: ["Convener", "Stakeholder", "BU Head"] },
        { name: "Re-Submitted Notes", link: "/ReSubmittedNote", roles: ["Convener L2"] },
        { name: "Sign-Off Given", link: "/SignedOffGiven", roles: ["Convener L2", "Stakeholder"] },
        { name: "Rejected Notes", link: "/RejectedNotes", roles: ["Convener L2", "SDG Owner", "BU Level"] },
        { name: "Post-Go Live", link: "/PostGoLive", roles: ["IT/Compliance"] },
    ];

    return (
        <Nav className="justify-content-start mb-3 bg-white rounded p-1">
            {tabs
                .filter(tab => user.roles && tab.roles.includes(user.roles))
                .map((tab) => (
                    <Nav.Item key={tab.name} className="mx-1">
                        <Nav.Link
                            as={Link}
                            to={tab.link}
                            className={`btn btn-outline-primary ${location.pathname === tab.link ? "active btn-primary text-white" : ""}`}
                        >
                            {tab.name}
                        </Nav.Link>
                    </Nav.Item>
                ))}
        </Nav>
    );
};

export default TabNavigation;
