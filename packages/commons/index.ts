export type signup={
    username:string,
    password:string
}


export type createtodo = {
    title:string
    desc:string
    userid:string
}

export type updatetodo = {
    id:string
    title:string
    desc:string
    userid:string
}

export type detetetodo = {
    id:string
    userid:string
}