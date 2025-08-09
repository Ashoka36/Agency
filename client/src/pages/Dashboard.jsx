import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Briefcase, Users, FileText, Plus, LogOut, Search, MapPin, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout, isRecruiter, isCandidate } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        axios.get('/api/jobs', { withCredentials: true }),
        axios.get('/api/applications', { withCredentials: true })
      ]);
      
      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const email = prompt('Enter your email:');
      const phone = prompt('Enter your phone number:');
      const coverLetter = prompt('Enter a brief cover letter:');
      
      if (email && phone && coverLetter) {
        await axios.post('/api/applications', {
          jobId,
          email,
          phone,
          coverLetter
        }, { withCredentials: true });
        
        alert('Application submitted successfully!');
        fetchData();
      }
    } catch (error) {
      alert('Error submitting application');
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, 
        { status }, 
        { withCredentials: true }
      );
      fetchData();
    } catch (error) {
      alert('Error updating application status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading{/* REPLACED_PLACEHOLDER */}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TalentHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.username} ({user.role})
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
              <p className="text-xs text-muted-foreground">
                Active job postings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                {isCandidate ? 'Your applications' : 'Total applications'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending applications
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
              {isRecruiter && (
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {job.salary}
                        </div>
                        <div className="text-xs text-gray-500">{job.type}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements?.slice(0, 3).map((req, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                    {isCandidate && (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleApply(job.id)}
                      >
                        Apply Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Applications Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isCandidate ? 'Your Applications' : 'Recent Applications'}
            </h2>
            
            <div className="space-y-4">
              {applications.map((application) => {
                const job = jobs.find(j => j.id === application.jobId);
                return (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {job?.title || 'Job Title'}
                          </CardTitle>
                          <CardDescription>
                            {isCandidate ? job?.company : application.candidateName}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!isCandidate && (
                        <div className="space-y-2">
                          <p className="text-sm"><strong>Email:</strong> {application.email}</p>
                          <p className="text-sm"><strong>Phone:</strong> {application.phone}</p>
                          <p className="text-sm"><strong>Cover Letter:</strong> {application.coverLetter}</p>
                          
                          {application.status === 'pending' && (
                            <div className="flex space-x-2 mt-4">
                              <Button 
                                size="sm" 
                                onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {applications.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {isCandidate ? 'No applications yet' : 'No applications received'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

