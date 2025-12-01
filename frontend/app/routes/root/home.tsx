import { Link } from 'react-router';
import { Button } from '../../components/ui/button';



export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <Link to="/auth/sign-in">
          <Button className="bg-blue-500">SignIn</Button>
        </Link>
        <Link to="/auth/sign-up">
          <Button variant="ghost">SignUp</Button>
        </Link>
      </div>
    </div>
  );
}
