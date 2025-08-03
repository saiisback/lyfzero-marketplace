import OwnedNFTsTab from '@/components/profile/OwnedNFTsTab';
import CreatedProjectsTab from '@/components/profile/CreatedProjectsTab';

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="space-y-8">
        <OwnedNFTsTab />
        <CreatedProjectsTab />
      </div>
    </div>
  );
}