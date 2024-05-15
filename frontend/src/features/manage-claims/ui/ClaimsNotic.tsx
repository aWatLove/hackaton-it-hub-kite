import { useCurrentUser } from '@/entities/session/model/queries';
import { useClaimsQuery } from '@/entities/claim/model/queries';
import { Notifications } from '@/shared/icons/Notifications';
import Link from 'next/link';
import { P } from '@/shared/ui/typography';

export const ClaimsNotic = () => {
    const { data: user } = useCurrentUser();
    const logged = !!user;
    const { data: claims } = useClaimsQuery(logged);
    if (!logged) return null;
    let no_acc = 0;
    //@ts-ignore
    claims?.claims.forEach((v) => {
        console.log(v);
        //@ts-ignore
        if (!v.accepted) no_acc++;
    });
    console.log({ no_acc });
    return (
        <Link href={`/user/${user.id}/claims`} className="relative hover:text-accent flex gap-1 items-center">
            <Notifications />
            {no_acc && <P className="text-accent">{no_acc}</P>}
        </Link>
    );
};
