import React, { useState, type FormEvent } from "react";
import CourseCard from "../components/CourseCard";
import Header from "../components/Header";
import { useCourseStore } from "../store/courseStore";
import { useNavigate } from "react-router-dom";
import { useTokenStore, type TokenType } from "../store/tokenStore";

const Home = () => {
    const loadCourse = useCourseStore((state) => state.loadCourse);
    const semester = useCourseStore((state) => state.semesters);
    const setToken = useTokenStore((state) => state.setToken);
    const navigate = useNavigate();

    const [input, setInput] = useState<TokenType>({
        portalToken: "",
        githubToken: "",
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setToken({
            portalToken: input.portalToken,
            githubToken: input.githubToken,
        });
        loadCourse(input.portalToken);
    };

    return (
        <div className="flex flex-col">
            <Header></Header>
            <main className="flex-1 flex-col items-center p-5">
                <form onSubmit={submitForm} className="w-150">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="portalToken">Portal Token</label>
                        <input
                            type="text"
                            id="portalToken"
                            name="portalToken"
                            value={input.portalToken}
                            onChange={handleInput}
                            className="px-2 py-1 outline-none border rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="githubToken">Github Token</label>
                        <input
                            type="text"
                            id="githubToken"
                            name="githubToken"
                            value={input.githubToken}
                            onChange={handleInput}
                            className="px-2 py-1 outline-none border rounded"
                        />
                    </div>
                    <div className="flex justify-end mt-3">
                        <button className="px-3 py-2 rounded bg-blue-500 text-white">
                            Lấy khoá học
                        </button>
                    </div>
                </form>
                <div className="grid grid-cols-4 gap-6 w-full mt-4 items-stretch">
                    {semester.flatMap((s) =>
                        s.courses.map((c: any) => (
                            <CourseCard
                                key={c.id}
                                courseName={c.name}
                                totalLesson={c.hour}
                                onClick={() => {
                                    navigate(`/courses/${c.id}`);
                                }}
                            />
                        )),
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
