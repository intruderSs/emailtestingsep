import React from "react";
import { motion } from 'framer-motion';


const Result = () => {
    return (
        <div className="result-parent">
            <motion.div className='verification-card'
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    default: {
                        duration: 0.3,
                        ease: [0, 0.71, 0.2, 1.01]
                    },
                    scale: {
                        type: "spring",
                        damping: 11,
                        stiffness: 100,
                        restDelta: 0.001
                    }
                }}
                layoutId="shahil"
            >
                <motion.i className="fa-solid fa-xmark fa-lg cancel"></motion.i>
                <div className='verification-div'>
                </div>
                <div className="table-container">
                    {/*table should be placed here*/}
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Link Name</th>
                                <th>Status</th>
                                <th>View More</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>John Doe</td>
                                <td>johndoe@example.com</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jane Smith</td>
                                <td>janesmith@example.com</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Bob Johnson</td>
                                <td>bobjohnson@example.com</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Bob Johnson</td>
                                <td>bobjohnson@example.com</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Bob Johnson</td>
                                <td>bobjohnson@example.com</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Result;
