import Link from "next/link";

export default function Generate() {
    return (
        <main>
            <section>
                <header>
                    <h1>Generate Timesheet</h1>
                </header>
                <div className="section-body">
                    <form action="">
                        <div className="form-group">
                            <div className="form-item">
                                <label htmlFor="fsrName">FSR Name</label>
                                <input type="text" name="fsrName" id="fsrName" />
                            </div>
                        </div>
                        <div className="form-group">
                            <h4>Mobilization Date</h4>
                            <div className="form-item">
                                <label htmlFor="workStartDate">Date of Work Start</label>
                                <input type="date" name="workStartDate" id="workStartDate" />
                            </div>
                            <div className="form-item">
                                <label htmlFor="workFinishDate">Date of Work Finish</label>
                                <input type="date" name="workFinishDate" id="workFinishDate" />
                            </div>
                        </div>
                        <div className="form-group">
                            <h4>Customer Information</h4>
                            <div className="form-item">
                                <label htmlFor="customerName">Customer Name</label>
                                <input type="text" name="customerName" id="customerName" />
                            </div>
                            <div className="form-item">
                                <label htmlFor="siteName">Site Name</label>
                                <input type="text" name="siteName" id="siteName" />
                            </div>
                            <div className="form-item">
                                <label htmlFor="siteCountry">Site Country</label>
                                <input type="text" name="siteCountry" id="siteCountry" />
                            </div>
                        </div>

                        <div className="form-group">
                            <h4>Project Information</h4>
                            <div className="form-item">
                                <label htmlFor="purchaseOrderNumber">Purchase Order (PO) Number</label>
                                <input type="text" name="purchaseOrderNumber" id="purchaseOrderNumber" />
                            </div>
                            <div className="form-item">
                                <label htmlFor="orderNumber">Order Number</label>
                                <input type="text" name="orderNumber" id="orderNumber" />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-item">
                                <button type="submit">Continue</button>
                            </div>
                        </div>
                    </form>
                </div>
                <footer>
                    <Link href="/">Go Back</Link>
                </footer>
            </section>
        </main>
    )
}