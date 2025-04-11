import React, { useState } from 'react';
import CardViewTrackTask from './CardViewTrackTask';
import TrackTask from './TrackTask';

const View: React.FC = () => {
    const [showView, setShowView] = useState(false);

    return (
        <>
            <div className="d-flex bg-white p-2 my-2 justify-content-between align-items-center fs-20">
                <span>
                    <i className="ri-file-list-line me-2"></i>
                    <span className="fw-bold test-nowrap">Track Task</span>
                </span>
                <span>
                    <i
                        className={`ri-layout-grid-fill cursor-pointer px-2 ${!showView ? 'text-dark' : 'text-muted'}`} // Change color if not active
                        onClick={() => setShowView(false)}
                    ></i>
                    <i
                        className={`ri-list-check cursor-pointer ${showView ? 'text-dark' : 'text-muted'}`} // Change color if active
                        onClick={() => setShowView(true)}
                    ></i>
                </span>
            </div>
            {!showView ? <CardViewTrackTask /> : <TrackTask />}
        </>
    );
};

export default View;
