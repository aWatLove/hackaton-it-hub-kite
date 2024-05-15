/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects(){
      return [
          {source:'/', destination:"/projects", permanent:true}
          ]
    },
    async rewrites(){
        return [
            {
                source:'/api/signup',
                destination:'http://77.222.53.231:8080/auth/signup'
            }
            // , {
                // source:'/api/signin',
                // destination:'/api/signin'
            // }

        ]
    }
};

export default nextConfig;
