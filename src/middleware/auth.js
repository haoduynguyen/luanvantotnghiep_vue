
export default function auth({to, next, router}) {
    let author = localStorage.getItem('author')
    if (!localStorage.getItem('author')) {
        next('/login');
    }
    //console.log(author);
    if (!author && to.name !== 'Register' && to.name !== 'Login' && to.name !== 'ThankYou')
        next('/login')

    if (author && to.name === 'login')
        next('/list')


    // let checkUser = await authorApi.getUser();
    // if (checkUser) {
    //     if (checkUser.status !== 200) // token fail
    //     {
    //         next('/admin/login');
    //     }
    // }

    next();
}
