import Link from "next/link";

export default function Preview() {
    return (
        <main>
            <section>
                <header>
                    <div className="preview-header-group main-title group-1">
                        <h3>Timesheet Preview</h3>
                        <div className="timesheet-period">
                            <p>
                                <span>{'03/19/2021'}</span>
                                <span>-</span>
                                <span>{'05/03/2021'}</span>
                            </p>
                        </div>
                    </div>
                    <div className="preview-header-group group-2">
                        <div className="timesheet-owner-group">
                            <h5>{'John Lagbaja'}</h5>
                        </div>
                        <div className="timesheet-owner-hours">
                            <p>Total hours</p>
                            <h3>
                                <span>
                                    <span>{37}</span>
                                    <span>h</span>
                                </span>
                                <span>
                                    <span>{30}</span>
                                    <span>m</span>
                                </span>
                            </h3>
                            <h5>
                                <span>{6}</span>
                                <span>days</span>
                            </h5>
                        </div>
                    </div>
                    <div className="preview-header-group group-3">
                        <div className="customer-and-site-info">
                            <div className="customer-info-group">
                                <p>
                                    <span className="info-label">Customer</span>
                                    <span className="info-value">{'Exxon Mobil'}</span>
                                </p>
                            </div>
                            <div className="site-info-group">
                                <p>
                                    <span className="site-info">
                                        <span className="info-label">Site Name</span>
                                        <span className="info-value">{'QIT'}</span>
                                    </span>
                                    <span className="country-info">
                                        <span>,</span>
                                        <span className="info-label">Country</span>
                                        <span className="info-value">{'Nigeria'}</span>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="project-info-group">
                            <div className="purchase-order-number-group">
                                <p className="purchase-order-number-info">
                                    <span className="info-label">PO Number</span>
                                    <span className="info-value">{'345678675432333'}</span>
                                </p>
                            </div>
                            <div className="order-number-group">
                                <p className="order-number-info">
                                    <span className="info-label">Order Number</span>
                                    <span className="info-value">{'34564342te'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="section-body">
                    <div className="week-wrapper">
                        <div className="wrapper-header">
                            <h4>Week {5}</h4>
                        </div>
                        <div className="timesheet-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Period</th>
                                        <th>Total hours</th>
                                        <th>Location</th>
                                        <th>Comment</th>
                                        <th>...</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span>{'Monday'}</span>
                                            <span>{'29 Apr 2024'}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <span>Start</span>
                                                <span>{'06:00'}</span>
                                            </span>
                                            <span>
                                                <span>Finish</span>
                                                <span>{'18:00'}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{12}</span>
                                            <span>hours</span>
                                        </td>
                                        <td>
                                            <span>{'Onshore'}</span>
                                        </td>
                                        <td>
                                            <span>{'Technical Support'}</span>
                                        </td>
                                        <td><button type="button">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>{'Tuesday'}</span>
                                            <span>{'29 Apr 2024'}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <span>Start</span>
                                                <span>{'06:00'}</span>
                                            </span>
                                            <span>
                                                <span>Finish</span>
                                                <span>{'18:00'}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{12}</span>
                                            <span>hours</span>
                                        </td>
                                        <td>
                                            <span>{'Onshore'}</span>
                                        </td>
                                        <td>
                                            <span>{'Technical Support'}</span>
                                        </td>
                                        <td><button type="button">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>{'Wednesday'}</span>
                                            <span>{'29 Apr 2024'}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <span>Start</span>
                                                <span>{'06:00'}</span>
                                            </span>
                                            <span>
                                                <span>Finish</span>
                                                <span>{'18:00'}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{12}</span>
                                            <span>hours</span>
                                        </td>
                                        <td>
                                            <span>{'Onshore'}</span>
                                        </td>
                                        <td>
                                            <span>{'Technical Support'}</span>
                                        </td>
                                        <td><button type="button">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>{'Thursday'}</span>
                                            <span>{'29 Apr 2024'}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <span>Start</span>
                                                <span>{'06:00'}</span>
                                            </span>
                                            <span>
                                                <span>Finish</span>
                                                <span>{'18:00'}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{12}</span>
                                            <span>hours</span>
                                        </td>
                                        <td>
                                            <span>{'Onshore'}</span>
                                        </td>
                                        <td>
                                            <span>{'Technical Support'}</span>
                                        </td>
                                        <td><button type="button">Edit</button></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>{'Friday'}</span>
                                            <span>{'29 Apr 2024'}</span>
                                        </td>
                                        <td>
                                            <span>
                                                <span>Start</span>
                                                <span>{'06:00'}</span>
                                            </span>
                                            <span>
                                                <span>Finish</span>
                                                <span>{'18:00'}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span>{12}</span>
                                            <span>hours</span>
                                        </td>
                                        <td>
                                            <span>{'Onshore'}</span>
                                        </td>
                                        <td>
                                            <span>{'Technical Support'}</span>
                                        </td>
                                        <td><button type="button">Edit</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <footer>
                    <div>
                        <button type="button">Save Data</button>
                    </div>
                </footer>
            </section>
            <Link href="/">Go Back</Link>
        </main>
    );
}