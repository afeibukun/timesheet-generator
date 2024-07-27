import Link from "next/link";

export default function DefaultData() {
    return (
        <main>
            <section>
                <header>
                    <h1>Default Data</h1>
                </header>
                <div className="section-body">
                    <form action="">
                        <div className="form-item">
                            <label htmlFor="defaultStartTime">Start Time</label>
                            <input type="time" name="defaultStartTime" id="defaultStartTime" />
                        </div>
                        <div className="form-item">
                            <label htmlFor="defaultFinishTime">Finish Time</label>
                            <input type="time" name="defaultFinishTime" id="defaultFinishTime" />
                        </div>
                        <div className="form-item">
                            <label htmlFor="defaultLocationType">Location Type</label>
                            <select name="defaultLocationType" id="defaultLocationType">
                                <option value="onshore">Onshore</option>
                                <option value="offshore">Offshore</option>
                            </select>
                        </div>
                        <div className="form-item">
                            <label htmlFor="defaultComment">Comment</label>
                            <textarea name="defaultComment" id="defaultComment" cols={30} rows={10}></textarea>
                        </div>

                        <div className="form-item">
                            <label htmlFor="weekStartDay">Week Start Day</label>
                            <select name="weekStartDay" id="weekStartDay">
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                        </div>

                        <div className="form-item">
                            <button type="button">Save Default Data</button>
                        </div>
                    </form>
                </div>
                <footer>
                    <Link href="/">Go Back</Link>
                </footer>
            </section>
        </main>
    );
}