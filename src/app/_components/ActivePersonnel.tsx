'use client'
import { Personnel } from "@/lib/services/meta/personnel";

type ActivePersonnelProp = {
    activePersonnel: Personnel
}
export default function ActivePersonnel({ activePersonnel }: ActivePersonnelProp) {
    return (
        <div className="active-personnel-container">
            <div className="active-personnel" id='active-personnel'>
                <div className="flex justify-between py-3 px-2 rounded bg-slate-200">
                    <div>
                        <h3>Active Personnel: <span className="underline">{activePersonnel.name}</span></h3>
                    </div>
                </div>
            </div>
        </div>
    )
}