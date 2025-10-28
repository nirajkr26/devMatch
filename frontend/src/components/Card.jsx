import React from 'react'

const Card = ({ user }) => {
    return (
        <div className="card bg-base-300 w-84 h-120 shadow-sm">
            <figure className="">
                <img
                    src={user?.photoUrl} />
                    {console.log(user.photoUrl)}
            </figure>
            <div className="card-body">
                <h2 className="card-title">{user.firstName + " " + user.lastName}</h2>
                <p>{user.age + ", " + user.gender}</p>
                <p>{user.about}</p>
                <div className="card-actions justify-around my-4">
                    <button className="btn bg-red-500  
                    text-2xl text-white">Ignore</button>
                    <button className="btn bg-green-600 text-2xl text-white">Interested</button>
                </div>
            </div>
        </div>
    )
}

export default Card